import crypto from 'crypto-js';
import DB from '../database/db';

const hash = function(password) {
  // TODO: add crypto JS
  return password;
};

export default class User {

  static create(name, email, password, callback) {
    const user = {
      name: name,
      email: email,
      password: hash(password),
    };
    DB.save('user', user, callback);
  }

  static get(id, callback) {
    DB.fetch('user', {id:id}, function(err, docs) {
      if (err) return callback(err);
      callback(null, docs[0])
    })
  }

  static authenticate(email, password, callback) {
    DB.fetch('user',{email:email}, function(err, docs) {
      console.log(docs, 'qeqwe');
      console.log(err, 'qeqwe');
      if (err) return callback(err);
      if (docs.length === 0) return callback();

      const user = docs[0];
      if (user.password === hash(password)) {
        callback(null, docs[0])
      } else {
        callback()
      }
    })
  }

  static changePassword(id, password, callback) {
    DB.update('user', {id:id}, {password: hash(password)}, function(err, affected) {
      if (err) return callback(err);
      callback(null, affected > 0)
    })
  }
}

