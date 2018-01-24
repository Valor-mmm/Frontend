import {inject, LogManager} from 'aurelia-framework';
import {ITweet} from "../../../services/svc/tweet/tweetUtils";
import {UserData} from "../../../services/svc/user/userData";
import {EventAggregator} from 'aurelia-event-aggregator';
import {IUser} from "../../../services/svc/user/userUtils";
import {UpdateSuccess} from "../../../services/updateMessages";

const logger = LogManager.getLogger('TweetTimeline');

@inject(UserData, EventAggregator)
export class TweetTimeline {

  tweets: ITweet[];
  userData: UserData;

  constructor(userData: UserData, ea: EventAggregator) {
    this.tweets = [];
    this.userData = userData;
    ea.subscribe(UpdateSuccess, () => {
      if (this.userData && this.userData.loggedInUser) {
        this.updateTimeline([this.userData.loggedInUser]);
      }
    });
  }

  public updateTimeline(users: IUser[]) {
    if (!users) {
      return;
    }

    for (const user of users) {
      if (user.tweets) {
        this.tweets = this.tweets.concat(user.tweets);
      }
    }
    this.tweets.sort(this.tweetUpdatedAtComparator);

  }

  public tweetUpdatedAtComparator(tweet1: ITweet, tweet2: ITweet) {
    const date1: number = Date.parse(tweet1.createdAt);
    const date2: number = Date.parse(tweet2.createdAt);
    if (isNaN(date1) || isNaN(date2)) {
      logger.warn('Tweet dates could not be parsed to a number', date1, date2);
      return 0;
    }
    return date1 - date2;
  }
}
