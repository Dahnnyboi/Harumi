const express = require('express')
const Post = require('../../models/Post.model')
const { UserModel }= require('../../models/User.model')
const { CommentModel } = require('../../models/Comment.model')
const router = express.Router()
const auth = require('../auth')

router.param('post', function(req, res, next, slug){
  Post.findOne({ slug: slug })
  .populate('author')
  .then(function(post) {
    if(!post) { return res.status(404).json({ message: 'Cannot find post'})}

    req.post = post
    return next()
  }).catch(next)
})

router.param('comment', function(req, res, next, id){
  CommentModel.findById(id)
    .then(function(comment) {
      if(!comment) { return res.status(401).json({ message: `Cannot find the comment ${comment}`})}

      req.comment = comment;

      return next()
    }).catch(next)
})

router.param('username', function(req, res, next, username){
  UserModel.findOne({ username: username })
    .then(user => {
      if(!user){ return res.status(401).json({ message: `Cannot find user ${user}`})}

      req.user = user

      return next()
    }).catch(next)
})

router.get('/feed/:username', auth.required, function(req, res, next){
  let limit = 2
  let offset = 0

  if(req.query.limit){
    limit = req.query.limit
  }

  if(req.query.offset){
    offset = req.query.offset
  }

  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: 'Cannot find the user' })}

      Promise.all([
        Post.find({ author: req.user._id })
          .limit(Number(limit))
          .skip(Number(offset * limit))
          .sort({createdAt: 'desc'})
          .populate('author')
          .exec(),
        Post.where({ author: req.user._id }).countDocuments()
      ]).then(function(results) {
        const posts = results[0]
        const postsCount = results[1]

        const pages = Math.ceil(postsCount / limit)
        return res.json({
          posts: posts.map(post => {
            return post.toJSON(user)
          }),
          username: req.user.username,
          postCount: postsCount,
          pagesLimit: pages
        })
      })
    }).catch(err => console.log(err))
})

router.get('/:username/post', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: `Cannot find the user ${user}`}) }
      Post.findOne({ author: req.user._id })
        .sort({createdAt: 'desc'})
        .populate('author')
        .exec()
        .then(post => {
          if(!post){ return res.status(200).json({ post: {} })}
          
          return res.json({ post: post.toJSON(user) })
        })
    })
})

// get feed CHECKED
router.get('/feed', auth.required, function(req, res, next){
  let limit = 2
  let offset = 0

  if(req.query.limit){
    limit = req.query.limit
  }

  if(req.query.offset){
    offset = req.query.offset
  }

  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: 'Cannot find the user' })}

      Promise.all([
        Post.find({ author: { $in: user.following }})
          .limit(Number(limit))
          .skip(Number(offset * limit))
          .sort({ createdAt: 'desc'})
          .populate('author')
          .exec(),
        Post.count({ author: {$in: user.following}})
      ]).then(function(results) {
        const posts = results[0]
        const postsCount = results[1]

        // console.log(posts)
        // console.log(postsCount)
		const pageLimit = Math.ceil(postsCount / limit)
		
        return res.json({
          posts: posts.map(function(post){
            return post.toJSON(user)
          }),
          postsCount: postsCount,
		      pagesLimit: pageLimit
        })
      })
    })
})

// create a post CHECKED
router.post('/', auth.required, function(req, res, next) {
  UserModel.findById(req.payload.id)
    .then(function(user) {
      if(!user) { return res.status(401).json({ message: 'Cannot find the user' })}

      const newPost = new Post({
        title: req.query.title
      })

      newPost.author = user

      newPost.save()
        .then(function(){
          return res.status(200).json({ post : newPost.toJSON(user) })
        }).catch(function(err){
          return res.status(422).json({ message: err})
        })
    })
    .catch(next)
})
// retrieve a post CHECKED
router.get('/:post', auth.required, function(req, res, next) {
  Promise.all([
    UserModel.findById(req.payload.id),
    req.post.populate('author').execPopulate()
  ]).then(function(results){
    const user = results[0]

      return res.status(200).json({ post: req.post.toJSON(user) })
    }).catch(next);
})
// update a post CHECKED
router.put('/:post', auth.required, function(req, res, next){
  console.log(req.body)
  UserModel.findById(req.payload.id)
    .then(user => { 
      if(req.post.author._id.toString() === req.payload.id.toString()){

        if(req.body.title){
          req.post.title = req.body.title
        }

        req.post.save()
          .then(() => {
            return res.status(200).json({ post : req.post.toJSON(user) })
          }).catch(next)
      } else {
        return res.status(403).json({ message: "author id is not equal to your id!"})
      }
    })
})

// delete a post CHECKED
router.delete('/:post', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(req.post.author._id.toString() === req.payload.id.toString()){
        console.log(req.post.author._id.toString())
        console.log(req.payload.id.toString())
        req.post.remove()
          .then(() =>{
            return res.json({ message: "Successfully deleted the post" }).status(403)
          })
      } else {
        return res.status(403).json({ message: "Failed to delete the post" })
      }
    }).catch(next)
})

// retrive all user that is favorited
router.get('/:post/favorite', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      return req.post.populate({
        path: 'favoriteUsers',
      }).execPopulate()
      .then(fav => {
        console.log(req.post.favoriteUsers)
        return res.status(200).json({ 
          users: req.post.favoriteUsers.map(favUser => {
            return favUser.toProfileJSON(user)
          }), 
          count: req.post.favoriteCount
        })
      })
    })
})

// favorite a post CHECKED
router.post('/:post/favorite', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: `Cannot find the user ${user}`})}

      req.post.updateFavoriteCount(1)
      req.post.updateFavoriteUser(user)

      req.post.save()
        .then(post =>{
          return res.json({ message: `Successfully favorite the post ${post.title}`}).status(204)
        })
        .catch(err => {
          return res.status(400).json({ message: "Unsuccessfully favorite the post"})
        })
    })
    .catch(next)
})

// unfavorite a post CHECKED
router.post('/:post/unfavorite', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: `Cannot find the user ${user}`})}
      
      req.post.updateFavoriteUser(user)

      req.post.save()
        .then(post =>{
          return res.json({ message: `Successfully unfavorite the post ${post.title}`}).status(204)
        })
        .catch(err => {
          return res.status(400).json({ message: `Unsuccessfully unfavorite the ${post}`})
        })
    }).catch(next)
})

// create a comment CHECKED
router.post('/:post/comments', auth.required, function(req, res, next){
  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user){ return res.status(401).json({ message: `Cannot find the user ${user}`})}

      const newComment = new CommentModel({
        author: user,
        post: req.post,
        comment: req.body.comment
      })

      newComment.save()
        .then(comment =>{
          req.post.addComment(comment)
          req.post.save().then(post => {
            return res.status(200).json({
              message: "Successfully saved the comment",
              id: comment._id
            })
          })
        })
        .catch(next)
    }).catch(next)
})

// retrive a comment CHECKED
router.get('/:post/comments', auth.required, function(req, res, next){
  const limit = 3;
  let offset = 0
  if(req.query.offset){
    offset = req.query.offset
  }

  UserModel.findById(req.payload.id)
    .then(user => {
      if(!user) { return res.status(401).json({ message: `Cannot find the user ${user}`}) }

      Promise.all([
        CommentModel.find({ post: { $in: req.post._id }})
        .sort({createdAt: 'desc'})
        .limit(Number(limit))
        .skip(Number(offset * limit))
        .populate('author')
        .exec(),
        CommentModel.find({ post: req.post._id }).countDocuments()
      ]).then(function(results) {
        const comments = results[0]
        const commentsCount = results[1]
        const pageLimit = Math.ceil(commentsCount / limit)

        if(comments.length === 0){
          return res.json({
            comments: [],
            post: req.post.toCommentsJSON(),
            commentscount: 0,
            pageLimit: 0
          })
        }

        return res.json({
          comments: comments.map(comment => {
            return comment.toJson(user)
          }),
          post: req.post.toCommentsJSON(),
          commentsCount: commentsCount,
          pageLimit: pageLimit
        })
      })

      
      // Post.find({ slug: req.params.slug })
      //   .sort({createdAt: 'desc'})
      //   .limit(Number(limit))
      //   .skip(Number(offset * limit))
      //   .populate({
      //     path: 'comments',
      //     populate: { path: 'author'}
      //   })
      //   .exec()
      //   .then(posts => {
      //     posts.map(post => {
      //       console.log(post)
      //       console.log(post.comments.author)
      //     })
      //   }).catch(err => console.log(err))
    })
  // UserModel.findById(req.payload.id)
  //   .then(user => {
  //     Promise.all([
  //       req.post.populate({
  //         path: 'comments',
  //         populate: { path: 'author' }
  //       }).execPopulate(),
  //       req.post
  //       .populate('comments')
  //       .execPopulate()
  //     ]).then(function(results){
  //       const author = results[0]
  //       const comments = results[1]

  //       console.log('comments', comments)
  //     })
  //   }).catch(err => console.log(err))
})
// delete a comment CHECKED
router.delete('/:post/comments/:comment', auth.required, function(req, res, next){
  if(req.comment.author._id.toString() === req.payload.id.toString()){

    req.post.deleteComment(req.comment._id)

    req.post.save()
      .then(
        CommentModel.find({ _id: req.comment._id }).remove().exec()
      )
      .then(function(){
        return res.json({ message: "Succesfully remove the comment"}).status(204)
      })
  } else {
    return res.status(403).json({ message: "Unauthorize to delete"})
  }
})

module.exports = router