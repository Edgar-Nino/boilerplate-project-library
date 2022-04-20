const {model, Schema} = require('mongoose')

const bookSchema = new Schema({
  title: {type: String},
  commentcount: {type: Number, default:0},
  comments:[String]
},{versionKey:false})

const Book = model('Book', bookSchema)

module.exports = Book