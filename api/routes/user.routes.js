const express = require('express')
const router = express.Router()
const {UserModel} = require('../../models/User.model')
const passport = require('passport')
const auth = require('../auth')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const dir = './public/'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.toLowerCase().split(' ').join('-')
    cb(null, uuidv4() + '-' + filename)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
})

router.post('/login', function(req, res, next) {

  if(!req.body.user.email && !req.body.user.password){
    return res.status(422).json({ errors: { message: "email & password can't be blank" }})
  }
  if(!req.body.user.email){
    return res.status(422).json({ errors: { message: "email can't be blank" }})
  }
  if(!req.body.user.password){
    return res.status(422).json({ errors: { message: "password can't be blank"}})
  }

  passport.authenticate('local', { session: false }, function(err, user, info) {
    if(err){ return next(err) }

    if(user){
      user.token = user.generateToken()
      return res.status(200).json({ user: user.toAuthJSON() })
    } else {
      console.log(info)
      return res.status(422).json({errors : info})
    }
  })(req, res, next);
})

router.put('/update', auth.required, upload.single('profileImage'), function(req, res, next){
  let profileImage
  let response = ''
  const img = req.file
  if(img){
    const imgPath = path.join(process.cwd(), '/public', req.file.filename)
    const contentType = path.extname(imgPath)
    const alt = path.parse(imgPath).name
    const dataFile = fs.readFileSync(imgPath)
    profileImage = {
      image: dataFile,
      alt: alt,
      contentType: contentType
    }
  }
  
  const usercreds = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    bio: req.body.bio,
    profileImg: profileImage
  }

  UserModel.findById(req.payload.id)
    .then(user => {
      user.updateUser(usercreds)
        .then(() => {
          if(req.body.password){
            response = 'Successfully saved the password'
          } else if(req.body.email){
            response = 'Successfully saved email'
          } else if(req.body.bio){
            response = 'Successfully saved bio'
          } else if(req.file){
            response = 'Successfully changed the profile image'
          }
          return res.json({ 
            user: user.getResources(),
            response: response
          }).status(200)
        }).catch(err => res.status(400).json({error: "cannot save changes"}))
    }).catch(err => res.status(400).json({
      error: "cannot find the user"
    }))
})

router.post('/signup', function(req, res, next) {
  console.log(req.body)
  let newUser = new UserModel()
  const imgPath = path.join(process.cwd(), '/public', '/blank-profile-img.png')
  const extname = path.extname(imgPath)
  const dataFile = fs.readFileSync(imgPath)
  const alt = path.parse(imgPath).name

  const image = {
    image: dataFile,
    alt: alt,
    contentType: extname
  }

  if(!req.body.user.username){
    return res.status(422).json({ errors: { message: "username can't be blank" }})
  }
  if(!req.body.user.email){
    return res.status(422).json({ errors: { message: "email can't be blank" }})
  }
  
  UserModel.find({ username: req.body.user.username })
    .then(user => {
      if(Array.isArray(user) && user.length){
        return res.status(422).json({ errors: { message: "username already existed!"}})
      } else {
        newUser.username = req.body.user.username
        newUser.email = req.body.user.email
        newUser.setPassword(req.body.user.password)
        newUser.profileImg = image
      
        newUser.save()
          .then(function(user){
            user.follow(user._id)
            return res.json(newUser.toAuthJSON())
          })
          .catch(next)
      }
    })
})

router.get('/:username', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: 'Cannot find the user' })}

      UserModel.findOne({ username: req.params.username })
        .then(findUser => {
          return res.status(200).json({
            user: findUser,
            isYourProfile: findUser.isYourProfile(user._id),
            isFollowing: user.isFollowing(findUser._id)
          })
          //return res.status(200).json({ user: findUser.toProfileJSON(user) })
        }).catch(err => {
          console.log(err)
          return res.status(422).json({ errors: { message: err }})
        })
    }).catch(next)
})

router.get('/search/:username', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: 'Cannot find the user' })}
      let limit = 4
      let regexp = new RegExp("^"+ req.params.username);
      Promise.all([
        UserModel.find({ username: regexp})
          .limit(Number(limit)),
        UserModel.where({username: regexp}).countDocuments()
      ]).then(results => {
          let users = results[0]
          let count = results[1]

          let more = count > limit
          return res.status(200).json({ 
            users: users.map(u => {
              return u.toProfileJSON(user)
            }),
            usersCount: count,
            more: more
          })
        })
    })
})

router.get('/search/feed/:username', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(u => {
      if(!u){ return res.status(401).json({ message: 'Cannot find the user'}) }

      let limit = 4
      let offset = 0
      if(req.query.offset){
        offset = req.query.offset
      }
      
      let regexp = new RegExp("^"+ req.params.username);
      Promise.all([
        UserModel.find({ username: regexp })
          .limit(Number(limit))
          .skip(Number(limit * offset)),
        UserModel.where({ username: regexp }).countDocuments()
      ]).then(results => {
        const users = results[0]
        const count = results[1]

        const pageLimit = Math.ceil(limit / count)
        return res.status(200).json({
          users: users.map(user => {
            return user.toProfileJSON(u)
          }),
          count: count,
          pageLimit: pageLimit
        })
      })
    })
})

router.get('/:username/resources', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.json({ message: 'cannot find user'})}

      return res.status(200).json({
        resources: user.getResources()
      })
    }).catch(err => res.json({ message: 'failed to get resources'}))
})

module.exports = router
