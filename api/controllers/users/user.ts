import * as express from 'express';
import User from '../../models/user';

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

module.exports = router;
