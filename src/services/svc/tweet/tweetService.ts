import {inject, LogManager} from 'aurelia-framework';
import {FetchClient, QueryObject} from "../../FetchClient";
import FetchConfig from "../../fetchConfigLocal";
import {TweetData} from "./tweetData";
import {ITweet, TweetUtils} from "./tweetUtils";
import {ImageService} from "../imageService";
import {UserData} from "../user/userData";
import {IUser} from "../user/userUtils";

const logger = LogManager.getLogger('TweetService');

@inject(FetchClient, FetchConfig, ImageService, UserData)
export class TweetService {

  fetchClient: FetchClient;
  fetchConfig: FetchConfig;

  userData: UserData;

  constructor(fetchClient: FetchClient, fetchConfig: FetchConfig, private imageService: ImageService, ud: UserData) {
    this.fetchClient = fetchClient;
    this.fetchConfig = fetchConfig;
    this.userData = ud;
  }

  async getTweetsById(ids: string[]) {
    try {
      const plainTweets = await this.fetchClient.get(this.fetchConfig.tweetsPart, {ids: ids});
      if (!Array.isArray(plainTweets)) {
        logger.error('Fetched tweet array is no array.');
        return null;
      }
      const tweets: ITweet[] = [];
      for (const plainTweet of plainTweets) {
        const tweet: ITweet = TweetUtils.mapToTweet(plainTweet);
        tweets.push(tweet);
      }
      return tweets;
    } catch (error) {
      logger.error('Can not fetch tweets', error);
      return null;
    }
  }

  async createTweet(image: File, content: string) {
    let imageId = null;
    if (image) {
      imageId = await this.imageService.saveImage(image);
    }

    const tweetData = {
      content: content,
      poster: this.userData.loggedInUser.id,
      upvotes: 0,
    };

    if (imageId) {
      tweetData['image'] = imageId;
    }

    try {
      const result = await this.fetchClient.postJSON(this.fetchConfig.tweetsPart, tweetData);
      const newTweet = TweetUtils.mapToTweet(result);
      newTweet.poster = this.userData.loggedInUser;
      return newTweet;
    } catch (err) {
      logger.error('Error during creation of tweet.', err);
      return null;
    }
  }

  async deleteTweets(tweets: ITweet[]) {
    if (!Array.isArray(tweets)) {
      return;
    }

    const idArr: string[] = [];
    for (const tweet of tweets) {
      idArr.push(tweet.id);
    }

    try {
      return await this.fetchClient.delete(this.fetchConfig.tweetsPart, {ids: idArr});
    } catch (err) {
      logger.error('Error during deleting tweets.', err);
      return false;
    }

  }

}
