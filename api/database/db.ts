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
    // const keyName = `${store}:${uniqueID}`;
    // data.uuid = uniqueID;
    // data.store = store;
    // const flattenData = flatten(data, {
    //   safe: true
    // });
    //
    // const hmData = Object.keys(flattenData).reduce((result: any, fieldName: any) => {
    //   let fieldData = flattenData[fieldName];
    //   return result.concat([fieldName, fieldData]);
    // }, [keyName]);
    //
    // return new Promise((resolve) => {
    //   try {
    //     client.hmsetAsync(hmData).then((response) => {
    //       if (response) {
    //         client.saddAsync([store, keyName]);
    //         resolve(data);
    //       }
    //     });
    //   } catch(error) {
    //     console.log(error, 'save-record-error');
    //   }
    // });
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
          return new Promise.resolve(data);
        }
      }
    } catch(e) {
      console.log(e, 'there was an error');
    }
  }

  private removeFromStore() {

  }

  /**
   * Fetch all data from selected store
   *
   * @param store
   * @returns {Bluebird}
   */
  fetchAll(store: string) {
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
  fetchByUuid(store: string, uuid: string) {
    const keyName = `${store}:${uuid}`;
    console.log(keyName);
    return new Promise(resolve => {
      client.hgetallAsync(keyName).then(object => {
        const unFlattenData = unflatten(object, { object: true });
        resolve(unFlattenData);
      })
    })
  }

  async update(store: string, data: any) {
    // console.log(data, 'dasda');
    // const keyName = `${store}:${data.uuid}`;
    // const dataExist = await client.existsAsync(keyName);
    // if (dataExist) {
    //   const dataRemoved = await client.delAsync(keyName);
    //   if (dataRemoved) {
    //
    //   }
    // }
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
