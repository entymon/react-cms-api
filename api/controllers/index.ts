import * as express from 'express';
import passport from 'passport';
import passportJWT from "passport-jwt";
import User from '../models/user';
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
  secretOrKey: process.env.AUTH0_SECRET
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {

  const userModel = new User();
  const userPromise = userModel.getByUuid(jwt_payload.uuid);

  userPromise.then((user) => {
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  })
});

passport.use(strategy);

router.post('/login', (req, res, next) =>{
  let name = '';
  let password = '';
  if(req.body.name && req.body.password){
    name = req.body.name;
    password = req.body.password;
  }

  const userModel = new User();
  const userPromise = userModel.getUserByName(name);

  userPromise.then(user =>{
    if( ! user ) {
      res.status(401).json({message: "no such user found"});
    }

    if(user.password === password) {
      const payload = {uuid: user.uuid};
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({message: "ok", token: token});
    } else {
      res.status(401).json({message:"passwords did not match"});
    }
  });
});

router.get("/secretDebug",
  (req, res, next) => {
    console.log(req.get('Authorization'));
    next();
  }, (req, res) => {
    res.json("debugging");
  });

router.get("/secret", passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json("Success! You can not see this without a token");
});

module.exports = router;
