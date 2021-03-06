import * as express from 'express';
let router = express.Router();

import Post from '../../models/post';
import auth from '../../middlewares/auth';
import bodyJson from "../../middlewares/bodyJson";

router.get('/', function(req, res) {
  const postModel = new Post;
  postModel.getAll().then(posts => {
    res.json({
      status: 'success',
      message: '',
      body: posts
    })
  });
});

router.get('/:uuid', function(req, res) {
  const postModel = new Post;
  postModel.getByUuid(req.params.uuid).then(post => {
    res.json({
      status: 'success',
      message: '',
      body: post
    })
  });
});

/**
 * Body: JSON.stringify({Object})
 */
router.post('/', bodyJson, (req, res) => {
  const postModel = new Post;
  postModel.create(req.body.json).then(post => {
    res.json({
      status: 'success',
      message: 'post was added',
      body: post
    })
  });
});

/**
 * Body: JSON.stringify({Object})
 */
router.put('/', bodyJson, function(req, res) {
  const postModel = new Post;
  postModel.edit(req.body.json).then(post => {
    res.json({
      status: 'success',
      message: 'post was updated',
      body: post
    });
  });
});

router.delete('/:uuid', function(req, res) {
  const postModel = new Post;
  postModel.remove(req.params.uuid).then(success => {
    (success) ? res.json({
      status: 'success',
      message: 'post was removed',
      body: success
    }) : res.json({
      status: 'error',
      message: '',
      body: ''
    });
  });
});

module.exports = router;
