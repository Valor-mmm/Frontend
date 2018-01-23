import {inject, LogManager} from 'aurelia-framework';
import {FetchClient, QueryObject} from "../../FetchClient";
import FetchConfig from "../../fetchConfigLocal";
import {TweetData} from "./tweetData";
import {ITweet, TweetUtils} from "./tweetUtils";

const logger = LogManager.getLogger('TweetService');

@inject(FetchClient, FetchConfig, TweetData)
export class TweetService {

  fetchClient: FetchClient;
  fetchConfig: FetchConfig;

  constructor(fetchClient: FetchClient, fetchConfig: FetchConfig, private tweetData: TweetData) {
    this.fetchClient = fetchClient;
    this.fetchConfig = fetchConfig;
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
      logger.error('Can not fetch tweets', error)
      return null;
    }
  }

}
