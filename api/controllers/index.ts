import Post from '../models/post';

router.use('/post', require('./post'));
router.use('/users', require('./users'));

router.get('/', function(req, res) {
  Post.all(function(err, posts) {
    res.render('index', {posts: posts})
  })
});

module.exports = router;
