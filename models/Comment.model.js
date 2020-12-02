const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User'},
  post: { type: Schema.Types.ObjectId, ref: 'Post'},
  comment: { type: String, required: true }
}, { timestamps: true})


CommentSchema.methods.toJson = function(user){
  return {
    id: this._id,
    comment: this.comment,
    createdAt: this.createdAt,
    author: this.author.toProfileJSON(user),
    isYourComment: this.author.isYourComment(user)
  }
}

module.exports = {
  CommentSchema,
  CommentModel: new mongoose.model('Comment', CommentSchema)
}