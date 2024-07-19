/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
let mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  comments: Array
});

let Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find(function(err, data){
        if(err) return console.log(err)
        res.json(data.map(obj => {
          return {
            _id: obj._id,
            title: obj.title,
            commentcount: obj.comments.length,
            comments: obj.comments
          }
        }))
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        res.send('missing required field title')
      }
      var book = new Book({title: title})
      book.save(function(err, data){
        if(err) return console.log(err)
        res.json({_id: data._id, title: data.title})
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany(function(err, data){
        if(err) return console.log(err)
        res.send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function(err, data){
        if(err) return console.log(err)
        if(!data){
          res.send('no book exists')
        }else{
          res.json({
            _id: data._id,
            title: data.title,
            commentcount: data.comments.length,
            comments: data.comments
          })
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        res.send('missing required field comment')
      }else{
        Book.findById(bookid, function(err, data){
          if(err) return console.log(err)
          if(!data){
            res.send('no book exists')
          }else{
            data.comments.push(comment)
            data.save(function(err, data){
              console.log(data)
              res.json({
                _id: data._id,
                title: data.title,
                commentcount: data.comments.length,
                comments: data.comments
              })
            })
          }
        })
      }
      
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid, function(err, data){
        if(err) return console.log(err)
        if(!data){
          res.send('no book exists')
        }else{
          res.send('delete successful')
        }
      })
    });
  
};
