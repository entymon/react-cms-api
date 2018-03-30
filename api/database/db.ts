const redis = require('redis');
const Promise = require('bluebird');
const unflatten = require('flat').unflatten
import uuid from 'uuid/v4';
import flatten  from 'flat';


const client = redis.createClient();
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

client.on('connect', () => {
  console.log('connected');
});

export default class DB {

  /**
   * Saves data for store as [store:uuid] and save key in keys store as [store]
   *
   * For example:
   *  single post: 'posts:45ca20bd-7d81-400c-a7c1-dd37d3c418aa' {Object Post},
   *  single post: 'posts:fecaa164-a842-4a16-a1e8-6c8bf403eaf9'' {Object Post},
   *
   *  Store of keys: 'posts [
   *     '45ca20bd-7d81-400c-a7c1-dd37d3c418aa',
   *     'fecaa164-a842-4a16-a1e8-6c8bf403eaf9'
   *   ]
   *
   * @param store
   * @param data [JSON]
   * @param callback
   */
  static save(store: string, data, callback) {
    const keyName = uuid();
    const flattenData = flatten(data, {
      safe: true
    });

    const hmData = Object.keys(flattenData).reduce((result: any, fieldName: any) => {
      let fieldData = flattenData[fieldName];
      return result.concat([fieldName, fieldData]);
    }, [keyName]);

    client.hmsetAsync(hmData).then((response, errorHmset) => {
      if (response) {
        client.saddAsync([store, keyName]).then((replay, error) => {
          (error) ? console.log(error, 'error [redis-sadd]') : '';
        })
      } else {
        (errorHmset) ? console.log(errorHmset, 'error [redis-hmset]') : '';
      }
    });
  }

  /**
   * Fetch all data from selected store
   * @param store
   * @returns {Bluebird}
   */
  static fetchAll(store) {
    return new Promise((resolve) => {
      client.smembersAsync(store).then((data) => {
        Promise.all(data.map((singleKey) => client.hgetallAsync(singleKey))).then((data) => {
          const unFlattenData = data.map((object) => unflatten(object, { object: true }));
          resolve(unFlattenData);
        });
      });
    })
  }

  static update(dbname, target, data, callback) {

  }
}
