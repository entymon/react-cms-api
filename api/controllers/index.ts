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
  //     firstName: 'Pawel',
  //     lastName: 'Olejniczak'
  //   },
  //   title: 'Redis first steps',
  //   description: 'Lorem ipsum dolor semit'
  // });
  // postModel.create({
  //   author: {
  //     firstName: 'Tomasz011ac',
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



  // GET POST BY UUID
  // postModel.getByUuid('6853dc87-4f4b-4afd-b054-1deeb8c146b5').then(post => {
  //   res.send({post: post})
  // });



  // UPDATE POST
  // postModel.update({
  //   uuid: 'posts:37253f4d-a845-4bb4-b170-4758a6f06005',
  //   author: {
  //     firstName: 'PawelXXX',
  //     lastName: 'Olejniczak'
  //   },
  //   title: 'Redis first steps',
  //   description: 'Lorem ipsum dolor semit'
  // });


  
  // DELETE POST
  // postModel.delete('abef812d-0007-4658-98ca-2f826c9b3254').then(post => {
  //   (post) ? res.send({success: 'removed'}) : res.send({error: 'error'});
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
