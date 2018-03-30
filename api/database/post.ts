import DB from "./db";

export default class Post extends DB{

  /**
   * ~ to table name
   */
  public storeName: string;

  public db: any;

  constructor() {
    super();
    this.storeName = 'posts';
  }

  async add(post) {
    const uuid = await DB.save(this.storeName, post);
    return uuid;
  }

  /**
   * Returns promise with all data
   * @returns {Bluebird}
   */
  getAll() {
    return DB.fetchAll(this.storeName);
  }
}
