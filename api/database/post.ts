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

  add(post): any {
    DB.save(this.storeName, post, (err, replay) => {
      console.log(replay, 'save');
    });
  }

  /**
   * Returns promise with all data
   * @returns {Bluebird}
   */
  getAll() {
    return DB.fetchAll(this.storeName);
  }
}
