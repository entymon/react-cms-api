import DB from "./db";

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
    return DB.save(this.storeName, post);
  }

  /**
   * Returns promise with all data
   * @returns {Bluebird}
   */
  getAll() {
    return DB.fetchAll(this.storeName);
  }

  getByUuid(uuid) {
    return DB.fetchByUuid(this.storeName, uuid)
  }

  update(post) {
    return DB.update(this.storeName, post);
  }

  delete(uuid: string) {
    return this.db.delete(this.storeName, uuid);
  }
}
