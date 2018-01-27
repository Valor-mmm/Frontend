import {inject} from "aurelia-framework";
import {IUser} from "./userUtils";
import {ITweet} from "../tweet/tweetUtils";
import {TweetDeleter} from "../tweet/tweetDeleter";
import {UserService} from "./userService";

@inject(TweetDeleter, UserService)
export class UserDeleter {

  constructor(private tweetDeleter: TweetDeleter, private userService: UserService) {

  }

  public async deleteUser (users: IUser[]) {
    if (!Array.isArray(users)) {
      return false;
    }

    const tweetsToDelete = UserDeleter.getTweetsToDelete(users);
    const deletionPromiseTweets = this.tweetDeleter.deleteTweets(tweetsToDelete, false);
    const deletionPromiseUsers = this.userService.deleteUsers(users);
    await deletionPromiseTweets;
    await deletionPromiseUsers;
    return true;
  }

  private static getTweetsToDelete(users : IUser[]) {
    if (!Array.isArray(users)) {
      return [];
    }

    let tweets: ITweet[] = [];
    for (const user of users) {
      if (!Array.isArray(user.tweets)) {
        continue;
      }

      tweets = tweets.concat(user.tweets);
    }

    return tweets;
  }

}
