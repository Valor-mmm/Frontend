import {ITweet} from "../../../services/svc/tweet/tweetUtils";

export class TweetWrapper {

  tweet: ITweet;
  isLoggedInUser: boolean;
  isFriend: boolean;

  constructor(tweet: ITweet, isLoggedInUser: boolean, isFriend: boolean) {
    this.tweet = tweet;
    this.isLoggedInUser = isLoggedInUser;
    this.isFriend = isFriend;
  }
}
