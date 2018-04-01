import * as express from 'express';
import User from '../../models/user';
import Post from "../../models/post";
import bodyJson from "../../middlewares/bodyJson";

const router = express.Router();

router.get('/', function(req, res) {
  const userModel = new User;
  userModel.getAll().then(users => {
    res.json({
      status: 'success',
      message: '',
      body: users
    })
  });
});

router.get('/:uuid', function(req, res) {
  const userModel = new User;
  userModel.getByUuid(req.params.uuid).then(post => {
    res.json({
      status: 'success',
      message: '',
      body: post
    })
  });
});

/**
 * Object <User> {
      name: string;
      password: string;
      permission: boolean;
    }
 */
router.post('/', bodyJson, (req, res) => {
  const userModel = new User;
  userModel.create(req.body.json).then(user => {
    res.json({
      status: 'success',
      message: 'user was added',
      body: user
    })
  });
});

module.exports = router;
