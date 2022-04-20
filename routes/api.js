/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/book')
const mongoose = require('mongoose')
module.exports = function(app) {

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  app.route('/api/books')
    .get(async function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const result = await Book.find({}, '-comments').exec()
        res.json(result)
      } catch (err) {
        res.send('could not find any books')
      }
    })

    .post(async function(req, res) {
      try {
        let { title } = req.body;
        if (!title) { res.send('missing required field title'); return; }
        const book = new Book({ title: title })
        const newBook = await book.save()
        const { commentcount, comments, ...bookC } = newBook._doc
        res.json(bookC)
      } catch (err) {
        res.send('could not create book')
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(async function(req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({})
        res.send('complete delete successful')
      } catch (err) {
        res.send('could not delete any books')
      }
    });



  app.route('/api/books/:id')
    .get(async function(req, res) {
      try {
        let bookid = req.params.id;
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        const result = await Book.findById(bookid).exec()
        if (!result) { res.send('no book exists'); return; }
        res.json(result)
      } catch (err) {
        res.send('no book exists')
      }
    })

    .post(async function(req, res) {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        if (!comment) { res.send('missing required field comment'); return; }
        //json res format same as .get
        const result = await Book.findByIdAndUpdate(bookid, { $push: { comments: comment }, $inc: { commentcount: 1 } }, { new: true })
        if (!result) { res.send('no book exists'); return; }
        res.json(result)
      } catch (err) {
        res.send('no book exists')
      }
    })

    .delete(async function(req, res) {
      try {
        let bookid = req.params.id;
        const result = await Book.deleteOne({ _id: bookid }).exec()
        if (result.deletedCount == 0) { res.send('no book exists'); return; }
        res.send('delete successful')
        //if successful response will be 'delete successful'
      } catch (err) {
        res.send('no book exists')
      }
    });

};
