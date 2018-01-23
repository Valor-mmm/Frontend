import {ITweet} from "./tweetUtils";

export class TweetData {
  tweets: ITweet[];
  tweetsByFriend: Map<string, ITweet>;
  allTweets: ITweet[];

}
