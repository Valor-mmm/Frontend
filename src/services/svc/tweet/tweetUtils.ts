import {IUser} from "../user/userUtils";

export interface ITweet {

  id: string,
  updatedAt: string,
  createdAt: string

  content: string,
  image?: string,
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

  image?: string;

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
    if (object._id) {
      tweetObject.id = object._id;
    }
    return tweetObject;

  }

  public static dePopulateUser(tweet: ITweet) {
    if (!tweet) {
      return null;
    }

    const posterId: any = tweet.poster.id;
    tweet.poster = posterId;
    return tweet;
  }

  public static mapFromTweet(tweet: ITweet) {
    if (!tweet) {
      return null;
    }

    let newObject: any = this.dePopulateUser(tweet);
    delete newObject._v0;
    delete newObject.id;
    delete newObject._id;
    delete newObject.createdAt;
    delete newObject.updatedAt;
    return newObject;
  }
}
