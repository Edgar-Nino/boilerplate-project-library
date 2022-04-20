/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let idbook = null;

suite('Functional Tests', function() {

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ title: 'Harry Potter' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Harry Potter', 'title must contain "Harry Potter"')
            assert.isDefined(res.body._id, '_id must be defined')
            idbook = res.body._id
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ title: '' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title', 'body must contain "missing required field title"')
            done();
          })
      });

    });

    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'body must be an array')
            assert.isAtLeast(res.body.length, 1, 'array must contain at least one book')
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .get(`/api/books/${idbook}`)
          .end((err, res) => {
            const { title, comments, commentcount, _id } = res.body
            assert.equal(res.status, 200);
            assert.equal(title, 'Harry Potter', 'Title must contain "Harry Potter"')
            assert.equal(_id, idbook, '_id')
            assert.isArray(comments, 'comments must be an array')
            assert.equal(comments.length, 0, 'comments must contain 0 comments')
            assert.equal(commentcount, 0, 'comments must contain 0 comments')
            done();
          })
      });

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .get(`/api/books/abc`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'res.text must contain "no book exists"')
            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai
          .request(server)
          .post(`/api/books/${idbook}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ comment: 'Hello' })
          .end((err, res) => {
            const { title, comments, commentcount, _id } = res.body
            assert.equal(res.status, 200);
            assert.equal(title, 'Harry Potter', 'Title must contain "Harry Potter"')
            assert.equal(_id, idbook, '_id')
            assert.isArray(comments, 'comments must be an array')
            assert.equal(comments.length, 1, 'comments must contain 1 comment')
            assert.equal(comments[0], 'Hello', 'first comment must contain "Hello"')
            assert.equal(commentcount, 1, 'comments must contain 1 comment')
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai
          .request(server)
          .post(`/api/books/${idbook}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ comment: '' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment', 'res.text must contain "missing required field comment"')
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai
          .request(server)
          .post(`/api/books/abc`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ comment: 'Hello' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'res.text must contain "no book exists"')
            done();
          })
      });

    });

    /*
* ----[EXAMPLE TEST]----
* Each test should completely test the response of the API end-point including response status code!
*/
    test('#example Test GET /api/books', function(done) {
      chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
    });
    /*
    * ----[END of EXAMPLE TEST]----
    */

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        console.log(idbook)
        chai
          .request(server)
          .delete(`/api/books/${idbook}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .end((err, resDel) => {
            assert.equal(resDel.status, 200);
            assert.equal(resDel.text, 'delete successful', 'res.text must contain "delete successful"')
            chai
              .request(server)
              .get(`/api/books/${idbook}`)
              .end((err, resGet) => {
                assert.equal(resGet.status, 200);
                assert.equal(resGet.text, 'no book exists', 'res.text must contain "no book exists"')
                done();
              })
          })
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .delete(`/api/books/abc`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'res.text must contain "no book exists"');
            done();
          })
      });

    });

  });

});
