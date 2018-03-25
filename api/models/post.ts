import DB from '../db';

export default class Post {

  static create(user, text, callback) {
    const post = {
      user: user,
      text: text,
      date: new Date().toString()
    };

    DB.save(post, callback);
  }

  static get(id, callback) {
    return DB.fetch({id:id}, function(err, docs) {
      if (err) return callback(err);
      callback(null, docs[0])
    })
  }

  static all(callback) {
    return DB.fetch({}, callback);
  }

  static allByUser(user, callback) {
    return DB.fetch({user: user}, callback);
  }
}
