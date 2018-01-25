import {ITweet} from "../tweet/tweetUtils";

export interface IUser {
  id: string,
  updatedAt: string,
  createdAt: string

  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string

  tweets?: ITweet[],
  following?: string[]
}

export class User implements IUser {
  id: string;
  updatedAt: string;
  createdAt: string;

  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  tweets?: ITweet[];
  following?: string[];

  constructor(id: string, updatedAt: string, createdAt: string, username: string, email: string, password: string, firstName: string, lastName: string) {
    this.id = id;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;

    this.tweets = [];
    this.following = [];
  }


}


export class UserUtils {

  public static isInstanceOfUser(object: any): object is IUser {
    return 'member' in object;
  }

  public static mapToUser(object: any) {
    if (!object) {
      return null;
    }

    const userObject: User = Object.assign({}, object);
    if (object._id) {
      userObject.id = object._id;
    }
    return userObject;

  }
}
