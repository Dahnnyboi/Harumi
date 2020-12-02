const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  image: Buffer,
  alt: String,
  contentType: String
})

module.export = ImageSchema