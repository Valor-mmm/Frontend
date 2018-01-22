import {ITweet} from "../tweetService";

export interface IUser {
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string

  tweets?: ITweet[],
  following?: IUser[]
}


export class UserUtils {

  public static isInstanceOfUser(object: any): object is IUser {
    return 'member' in object;
  }

}
