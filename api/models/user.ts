import CRUD from "./crud";

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
    // const phrase = `${this.storeName}:*`;
    // const userKeys = await this.client.kyesAsync(phrase);
    //
    // console.log(userKeys, 'useKeys');
  }
}

