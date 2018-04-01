import DB from './crud';

export interface IUserModelBase {
  name: string;
  password: string;
}

export interface IUserModel extends IUserModelBase {
  uuid: string;
}

export default class User extends DB {

  /**
   * ~ to table name
   */
  public storeName: string;

  constructor() {
    super();
    this.storeName = 'users';
  }

  create(user: IUserModelBase) {
    // TODO: add field validation
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

  edit(user: IUserModel): any {
    // TODO: add field validation
    return this.update(this.storeName, user);
  }

  remove(uuid: string) {
    return this.delete(this.storeName, uuid);
  }
}

