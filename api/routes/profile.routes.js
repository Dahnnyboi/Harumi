const express = require('express')
const auth = require('../auth')
const {UserModel} = require('../../models/User.model')
const router = express.Router()

router.param('username', function(req, res, next, username){
  console.log(username)
  UserModel.findOne({ username: username })
    .then(user => {
      if(!user) { return res.status(400).json({ message: `Cannot find the user : ${user}`})}

      req.profile = user

      return next()
    }).catch(next)
})

// check if you are following a user CHECKED
router.get('/:username', auth.required, function(req, res, next){
  console.log(req.payload.id)
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(400).json({ message: `Cannot find the user : ${user}`})}
      
      return res.status(200).json({ profile: req.profile.toProfileJSON(user) })
    })
})

// follow CHECKED
router.post('/:username', auth.required, function(req, res, next){
  const profileId = req.profile._id

  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user){ return res.status(404).json({ message: `Cannot find the user : ${user}`})}

      req.profile.addFollowers(user._id)

      return user.follow(profileId).then(() => {
        return res.status(200).json({ profile: req.profile.toProfileJSON(user)})
      })
    }).catch(next)
})
// unfollow
router.delete('/:username', auth.required, function(req, res, next){
  const profileId = req.profile._id

  UserModel.findById(req.payload.id)
    .then(user => { 
      if(!user){ return res.status(404).json({ message: `Cannot find the user : ${user}`})}

      req.profile.removeFollowers(user._id)

      return user.unfollow(profileId).then(() => {
        return res.status(200).json({ profile: req.profile.toProfileJSON(user)})
      })
    })
})
module.exports = router