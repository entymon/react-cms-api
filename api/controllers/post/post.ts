const Post = require('../models/post');
const auth = require('../middlewares/auth');

router.post('/', auth, function(req, res) {
  const user = req.user.id;
  const text = req.body.text;

  Post.create(user, text, function (err, post) {
    res.redirect('/')
  })
});

router.get('/:id', function(req, res) {
  Post.get(req.params.id, function (err, post) {
    console.log(post);
  })
});

module.exports = router;
