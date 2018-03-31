import * as express from 'express';
import User from '../../models/user'
import auth from "../../middlewares/auth";
const router = express.Router();

router.get('/', auth, function(req, res) {
  // get users with middleware auth function
});

module.exports = router;
