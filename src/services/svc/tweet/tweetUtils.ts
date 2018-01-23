import {IUser} from "../user/userUtils";

export interface ITweet {

  id: string,
  updatedAt: string,
  createdAt: string

  content: string,
  imgId?: string,
  poster: IUser,
  upvotes: number

}

export class Tweet implements ITweet {
  id: string;
  updatedAt: string;
  createdAt: string;

  content: string;
  poster: IUser;
  upvotes: number;

  imgId?: string;

  constructor(id: string, updatedAt: string, createdAt: string, content: string, poster: IUser, upvotes: number) {
    this.id = id;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.content = content;
    this.poster = poster;
    this.upvotes = upvotes;
  }

}

export class TweetUtils {

  public static mapToTweet(object: any) {
    if (!object) {
      return null;
    }

    const tweetObject: ITweet = Object.assign({}, object);
    return tweetObject;

  }
}
