import CRUD from "./crud";
import * as PromiseDB from 'bluebird';

export interface IUserModelBase {
  name: string;
  password: string;
  permission: boolean;
}

export interface IUserModel extends IUserModelBase {
  uuid: string;
}

export default class User extends CRUD {

  /**
   * ~ to table name
   */
  public storeName: string;

  constructor() {
    super();
    this.storeName = 'users';
  }

  create(user: IUserModelBase) {
    return this.save(this.storeName, user);
  }

  /**
   * Returns promise with all data
   * @returns {Bluebird}
   */
  getAll() {
    return this.fetchAll(this.storeName);
  }

  getByUuid(uuid) {
    return this.fetchByUuid(this.storeName, uuid)
  }

  async getUserByName(name: string) {
    const userHashes = await this.client.keysAsync(`${this.storeName}:*`);
    const userNames = await PromiseDB.all(userHashes.map(hash => this.client.hgetAsync(hash, 'name')));

    let userUuid = '';
    userNames.map((userName, index) => {
      if (userName === name) {
        userUuid = userHashes[index].replace(`${this.storeName}:`, '');
      }
    });
    return this.fetchByUuid(this.storeName, userUuid)
  }
}

