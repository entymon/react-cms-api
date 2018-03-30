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
   * Saves single data object for store as [store:uuid] and save key in keys store as [store]
   *
   * For example:
   *  single post: '45ca20bd-7d81-400c-a7c1-dd37d3c418aa' {Object Post},
   *  single post: 'fecaa164-a842-4a16-a1e8-6c8bf403eaf9' {Object Post},
   *
   *  Store of keys: 'posts [
   *     '45ca20bd-7d81-400c-a7c1-dd37d3c418aa',
   *     'fecaa164-a842-4a16-a1e8-6c8bf403eaf9'
   *   ]
   *
   * @param store
   * @param data - already saved data
   */
  static save(store: string, data) {
    const keyName = uuid();
    data.uuid = keyName;
    const flattenData = flatten(data, {
      safe: true
    });

    const hmData = Object.keys(flattenData).reduce((result: any, fieldName: any) => {
      let fieldData = flattenData[fieldName];
      return result.concat([fieldName, fieldData]);
    }, [keyName]);

    return new Promise((resolve) => {
      try {
        client.hmsetAsync(hmData).then((response) => {
          if (response) {
            client.saddAsync([store, keyName]);
            resolve(data);
          }
        });
      } catch(error) {
        console.log(error, 'save-record-error');
      }
    });


  }

  /**
   * Fetch all data from selected store
   *
   * @param store
   * @returns {Bluebird}
   */
  static fetchAll(store: string) {
    return new Promise((resolve) => {
      client.smembersAsync(store).then((data) => {
        Promise.all(data.map((singleKey) => client.hgetallAsync(singleKey))).then((data) => {
          const unFlattenData = data.map((object) => unflatten(object, { object: true }));
          resolve(unFlattenData);
        });
      });
    })
  }

  /**
   * Fetch data by uuid
   *
   * @param {string} store
   * @param {string} uuid
   * @returns {Bluebird}
   */
  static fetchByUuid(store: string, uuid: string) {
    return new Promise(resolve => {
      client.hgetallAsync(uuid).then(object => {
        const unFlattenData = unflatten(object, { object: true });
        resolve(unFlattenData);
      })
    })
  }

  static update(store: string, data) {

  }
}
