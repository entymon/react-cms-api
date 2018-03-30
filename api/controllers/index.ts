import * as express from 'express';
let router = express.Router();
// import Post from '../models/post';
import User from "../models/user";
import Post from "../database/post";

router.use('/post', require('./posts/post'));
router.use('/users', require('./users/user'));

router.get('/', function(req, res) {
  // res.send('Hello World');

  const postModel = new Post;

  // ADD NEW POST
  // postModel.add({
  //   author: {
  //     firstName: 'Pawel',
  //     lastName: 'Olejniczak'
  //   },
  //   title: 'Redis first steps',
  //   description: 'Lorem ipsum dolor semit'
  // });
  // postModel.add({
  //   author: {
  //     firstName: 'Tomasz',
  //     lastName: 'Zaradko'
  //   },
  //   title: 'Redis first steps',
  //   description: 'Lorem ipsum dolor semit'
  // }).then(post => {
  //   res.send({post: post})
  // });



  // GET ALL POSTS
  // postModel.getAll().then(posts => {
  //   res.send({posts: posts})
  // });

  postModel.getByUuid('de3b5b10-4878-426c-9276-036c5587afb5').then(post => {
    res.send({posts: post})
  })


  // Post.all(function(err, posts) {
  //   res.render('index', {posts: posts})
  // })
});

router.post('/login', (req, res, next) =>{

  console.log(req.body);
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user){
      if (error || !user) {
        return next(error);
      } else {
        req.session.userId = user._id;
        console.log(req.session.userId);
        return res.redirect('/profile');
      }
    })
  }else{
    const error = new Error("Not All Fields Filled Out.");
    error.status =  401;
    next(error);
  }
});

module.exports = router;
