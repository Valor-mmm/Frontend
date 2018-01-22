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
  following?: IUser[]
}


export class UserUtils {

  public static isInstanceOfUser(object: any): object is IUser {
    return 'member' in object;
  }

}
