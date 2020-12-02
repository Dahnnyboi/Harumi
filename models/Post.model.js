const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: { type: String, required: true },
  favoriteCount: { type: Number, default: 0 },
  favoriteUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }]
}, { timestamps: true })

PostSchema.plugin(uniqueValidator, {message: 'is already taken'});

PostSchema.pre('validate', function(next){
  if(!this.slug) {
    this.slugify()
  }

  next()
})

PostSchema.methods.updateFavoriteCount = function(count){
  this.favoriteCount += count
}

PostSchema.methods.updateFavoriteUser = function(user){
  if(isAlreadyFavorite(this.favoriteUsers, user)){
    console.log("already favorited")
    this.favoriteUsers.pull(user)
    this.favoriteCount--;
  } else {
    this.favoriteUsers.push(user)
  }
}

function isAlreadyFavorite(allUser, user){
  for(let i = 0; i < allUser.length; i++){
    if(allUser[i]._id.toString() === user._id.toString()){
      return true
    }
  }

  return false
}

PostSchema.methods.isFavorited = function (user){
  const favoritedUsers = this.favoriteUsers
  for(let i = 0; i < favoritedUsers.length; i++){
    if(favoritedUsers[i]._id.toString() === user._id.toString()){
      console.log("same id!")
      return true;
    }
  }

  return false
}

PostSchema.methods.addComment = function(comment){
  this.comments.push(comment)
}

PostSchema.methods.deleteComment = function(id){
  this.comments.remove(id)
}

PostSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
}

PostSchema.methods.isYourPost = function(id){
  return this.author._id.toString() === id.toString()
}

function commentsCount(comments){
  let com = comments;
  let commentsCount = comments.length
  return commentsCount
}

PostSchema.methods.toJSON = function(user){
  return {
    slug: this.slug,
    title: this.title,
    favoriteCount: this.favoriteCount,
    author: this.author.toProfileJSON(user),
    isFavorited: this.isFavorited(user),
    isYourPost: this.isYourPost(user._id),
    isFollowing: user.isFollowing(this.author._id),
    commentsCount: commentsCount(this.comments),
    comments: [],
    currentPage: 0,
    // the 3 comes from the limit from fetching comments in post.routes
    pageLimit: Math.ceil(commentsCount(this.comments) / 3),

    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

PostSchema.methods.toCommentsJSON = function(){
  return{
    slug: this.slug,
    title: this.title,
    date: this.createdAt
  }
}

module.exports = new mongoose.model('Post', PostSchema)