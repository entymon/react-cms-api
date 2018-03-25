import * as express from 'express';
let router = express.Router();

import Post from '../models/post';

router.use('/post', require('./posts/post'));
router.use('/users', require('./users/user'));

router.get('/', function(req, res) {
  Post.all(function(err, posts) {
    res.render('index', {posts: posts})
  })
});

module.exports = router;
