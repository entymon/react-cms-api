import crypto from 'crypto-js';

const hash = function(password) {
  return crypto.createHash('sha1').update(password).digest('base64')
};

export default class User {

  static create(name, email, password, callback) {
    const user = {
      name: name,
      email: email,
      password: hash(password),
    };
    db.save(user, callback)
  }

  static get(id, callback) {
    db.fetch({id:id}, function(err, docs) {
      if (err) return callback(err);
      callback(null, docs[0])
    })
  }

  static authenticate(email, password, callback) {
    db.fetch({email:email}, function(err, docs) {
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
    db.update({id:id}, {password: hash(password)}, function(err, affected) {
      if (err) return callback(err);
      callback(null, affected > 0)
    })
  }
}

