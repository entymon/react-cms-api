import * as express from 'express';
let router = express.Router();
import Post from '../models/post';
import User from "../models/user";

router.use('/posts', require('./posts/post'));
router.use('/users', require('./users/user'));

router.get('/', function(req, res) {
  res.send('Hello World');
});

router.post('/login', (req, res, next) =>{

});

router.post('/secret', (req, res, next) =>{

});

module.exports = router;
