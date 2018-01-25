import {inject} from 'aurelia-framework';
import {TweetService} from "./tweetService";
import {UserService} from "../user/userService";
import {ITweet} from "./tweetUtils";
import {IUser} from "../user/userUtils";

@inject(TweetService, UserService)
export class TweetDeleter {

  constructor(private tweetService: TweetService, private userService: UserService) {

  }

  public async deleteTweets(tweets: ITweet[]) {
    if (!Array.isArray(tweets)) {
      return;
    }

    const usersToUpdate: IUser[] = this.getUsersToUpdate(tweets);
    await this.updateUsers(usersToUpdate);
    await this.tweetService.deleteTweets(tweets);

    return;
  }



  private getUsersToUpdate(tweets: ITweet[]) {
    if (!Array.isArray(tweets)) {
      return;
    }

    const usersToUpdate: IUser[] = [];
    for (const tweet of tweets) {
      let user = usersToUpdate.find((foundUser: IUser) => {
        return foundUser.id === tweet.poster.id;
      });

      if (!user) {
        user = tweet.poster;
        usersToUpdate.push(user);
      }

      const tweetIndex = user.tweets.findIndex((foundTweet: ITweet) => {
        return foundTweet.id === tweet.id;
      });

      if (tweetIndex !== -1) {
        user.tweets.splice(tweetIndex, 1);
      }
    }

    return usersToUpdate;
  }

  private async updateUsers(users: IUser[]) {
    if (!Array.isArray(users)) {
      return;
    }

    const updatedUsers: Promise<boolean>[] = [];
    for (const toUpdate of users) {
      updatedUsers.push(this.userService.updateUser(toUpdate, true));
    }

    await Promise.all(updatedUsers);

    return;
  }

}
