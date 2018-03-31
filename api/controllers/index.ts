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

  // postModel.create({
  //   author: {
  //     firstName: 'Bogdan 122-oman',
  //     lastName: 'Zaradko'
  //   },
  //   title: 'Redis first steps',
  //   description: 'Lorem ipsum dolor semit'
  // }).then(post => {
  //   res.send({
  //     status: 'success',
  //     message: 'post was added',
  //     body: post
  //   })
  // });




  // GET ALL POSTS

  postModel.getAll().then(posts => {
    res.send({
      status: 'success',
      message: '',
      body: posts
    })
  });



  // GET POST BY UUID

  // postModel.getByUuid('6853dc87-4f4b-4afd-b054-1deeb8c146b5').then(post => {
  //   res.send({
  //     status: 'success',
  //     message: '',
  //     body: post
  //   })
  // });




  // UPDATE POST

  // postModel.update({
  //   uuid: '173a92b4-86eb-46d3-b4bd-429c75703909',
  //   store: 'posts',
  //   author: {
  //     firstName: 'PawelXXX',
  //     lastName: 'Olejniczak'
  //   },
  //   title: 'Redis first steps',
  //   description: 'Lorem ipsum dolor semit'
  // }).then(post => {
  //   res.send({
  //     status: 'success',
  //     message: 'post was updated',
  //     body: post
  //   });
  // });




  // DELETE POST

  // postModel.delete('abef812d-0007-4658-98ca-2f826c9b3254').then(post => {
  //   (post) ? res.send({
  //     status: 'success',
  //     message: 'post was removed',
  //     body: post
  //   }) : res.send({
  //     status: 'error',
  //     message: '',
  //     body: ''
  //   });
  // });

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
