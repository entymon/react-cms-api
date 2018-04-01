import CRUD from "./crud";

export default class Post extends CRUD {

  /**
   * ~ to table name
   */
  public storeName: string;

  constructor() {
    super();
    this.storeName = 'posts';
  }

  create(post) {
    // TODO: add field validation
    return this.save(this.storeName, post);
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

  edit(post) {
    // TODO: add field validation
    return this.update(this.storeName, post);
  }

  remove(uuid: string) {
    return this.delete(this.storeName, uuid);
  }
}
