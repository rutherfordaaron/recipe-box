import { ObjectId } from "mongodb";

export default class User {
  constructor(public username: string, public email: string, public password: string, public created: Date, public _id?: ObjectId) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.created = created;
    if (_id) {
      this._id = _id;
    }
  }
}