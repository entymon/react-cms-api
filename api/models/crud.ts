const redis = require('redis');
const PromiseDB = require('bluebird');
const unflatten = require('flat').unflatten;
import uuid from 'uuid/v4';
import flatten  from 'flat';


const client = redis.createClient();
PromiseDB.promisifyAll(redis.RedisClient.prototype);
PromiseDB.promisifyAll(redis.Multi.prototype);

client.on('connect', () => {
  console.log('connected');
});

/**
 * TODO: export file as a npm library CRUD for Redis
 */
export default class DB {

  /**
   * Saves single data object for store as [store:uuid] and save key in keys store as [store]
   *
   * For example:
   *  single post: 'posts:45ca20bd-7d81-400c-a7c1-dd37d3c418aa' {Object Post},
   *  single post: 'posts:fecaa164-a842-4a16-a1e8-6c8bf403eaf9' {Object Post},
   *
   *  Store of keys: 'posts [
   *     'posts:45ca20bd-7d81-400c-a7c1-dd37d3c418aa',
   *     'posts:fecaa164-a842-4a16-a1e8-6c8bf403eaf9'
   *   ]
   *
   * @param store
   * @param data - already saved data
   */
  save(store: string, data) {
    const uniqueID = uuid();
    return this.addToStore(store, uniqueID, data);
  }

  private async addToStore(store: string, uuid: string, data: any) {
    const keyName = `${store}:${uuid}`;
    data.uuid = uuid;
    data.store = store;
    const flattenData = flatten(data, {
      safe: true
    });

    const hmData = Object.keys(flattenData).reduce((result: any, fieldName: any) => {
      let fieldData = flattenData[fieldName];
      return result.concat([fieldName, fieldData]);
    }, [keyName]);

    try {
      const dataAdded = await client.hmsetAsync(hmData);
      if (dataAdded) {
        const keyStoreAdded = await client.saddAsync([store, keyName]);
        if (keyStoreAdded) {
          return new PromiseDB.resolve(data);
        }
      }
    } catch(e) {
      console.log(e, 'there was an error');
    }
  }

  /**
   * Fetch all data from selected store
   *
   * @param store
   * @returns {Bluebird}
   */
  fetchAll(store: string) {


    console.log(store);

    return new PromiseDB((resolve) => {
      client.smembersAsync(store).then((data) => {

        data.map((singleKey) => {
          console.log(singleKey);
          client.hgetallAsync('users:uuid').then(x => {
            console.log(x);
          })
        });

        PromiseDB.all(data.map((singleKey) => client.hgetallAsync(singleKey))).then((data) => {
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
  fetchByUuid(store: string, uuid: string) {
    const keyName = `${store}:${uuid}`;
    console.log(keyName);
    return new PromiseDB(resolve => {
      client.hgetallAsync(keyName).then(object => {
        const unFlattenData = unflatten(object, { object: true });
        resolve(unFlattenData);
      })
    })
  }

  /**
   * Updates record in store (replace old by new)
   * @param {string} store
   * @param {any} data
   * @returns {Promise<Bluebird.resolve>}
   */
  async update(store: string, data: any) {
    const keyName = `${store}:${data.uuid}`;
    const dataExist = await client.existsAsync(keyName);
    if (dataExist) {
      const dataRemoved = await client.delAsync(keyName);
      if (dataRemoved) {
        return this.addToStore(store, data.uuid, data);
      }
    }
  }

  /**
   * Removes data from store and key from keyStore
   * @param {string} store
   * @param {string} uuid
   * @returns {Promise<any>}
   */
  async delete(store: string, uuid: string) {
    const keyName = `${store}:${uuid}`;
    try {
      const dataExist = await client.existsAsync(keyName);
      if (dataExist) {
        const dataRemoved = await client.delAsync(keyName);
        if (dataRemoved) {
          return await client.sremAsync(store, keyName);
        }
      }
    } catch(error) {
      console.log(error, 'delete-redis-error');
    }
  }
}
