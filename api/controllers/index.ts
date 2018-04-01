import * as express from 'express';
const passport = require("passport");
import passportJWT from "passport-jwt";
import jwt from 'jsonwebtoken';
import _ from "lodash";
let router = express.Router();

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

router.use('/posts', require('./posts/post'));
router.use('/users', require('./users/user'));

router.get('/', function(req, res) {
  res.json({message: "Express is up!"});
});

// save in database
const users = [
  {
    uuid: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    uuid: 2,
    name: 'test',
    password: 'test'
  }
];

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: 'tasmanianDevil'
};

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  const user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);


router.post('/login', (req, res, next) =>{
  let name = '';
  let password = '';
  if(req.body.name && req.body.password){
    name = req.body.name;
    password = req.body.password;
  }
  // usually this would be a database call:
  const user = users[_.findIndex(users, {name: name})];
  if( ! user ){
    res.status(401).json({message:"no such user found"});
  }

  if(user.password === password) {
    const payload = {id: user.uuid};
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
});

router.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token");
});


module.exports = router;
