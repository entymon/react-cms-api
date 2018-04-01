import DB from "./crud";

export default class Post extends DB{

  /**
   * ~ to table name
   */
  public storeName: string;

  public db: any;

  constructor() {
    super();
    this.db = new DB();
    this.storeName = 'posts';
  }

  create(post) {
    return this.db.save(this.storeName, post);
  }

  /**
   * Returns promise with all data
   * @returns {Bluebird}
   */
  getAll() {
    return this.db.fetchAll(this.storeName);
  }

  getByUuid(uuid) {
    return this.db.fetchByUuid(this.storeName, uuid)
  }

  update(post) {
    return this.db.update(this.storeName, post);
  }

  delete(uuid: string) {
    return this.db.delete(this.storeName, uuid);
  }
}
