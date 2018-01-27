import {inject, LogManager} from 'aurelia-framework';
import {ITweet} from "../../../services/svc/tweet/tweetUtils";
import {UserData} from "../../../services/svc/user/userData";
import {IUser} from "../../../services/svc/user/userUtils";
import {BindingEngine} from 'aurelia-binding';
import {TimeLineDesc} from "./timelineDesc";
import {ValidationController, ValidationRules} from "aurelia-validation";
import {TweetService} from "../../../services/svc/tweet/tweetService";
import {ImageService} from "../../../services/svc/imageService";
import {EventAggregator} from 'aurelia-event-aggregator';
import {SwitchToFriend} from "../../../services/timelineMessage";
import {UserService} from "../../../services/svc/user/userService";
import {TweetWrapper} from "./TweetWrapper";
import {TweetDeleter} from "../../../services/svc/tweet/tweetDeleter";
import {UpdateRequest} from "../../../services/updateMessages";

const logger = LogManager.getLogger('TweetTimeline');

@inject(UserData, BindingEngine, ValidationController, TweetService, ImageService, EventAggregator, UserService, TweetDeleter)
export class TweetTimeline {

  tweets: TweetWrapper[];
  userData: UserData;
  timelineDescription: TimeLineDesc;

  content: string;
  image: FileList;
  validationController: ValidationController;
  creationError: string;

  oneSelected: boolean;


  constructor(userData: UserData, be: BindingEngine, vc: ValidationController, private tweetService: TweetService,
              private imageService: ImageService, private eventAggregator: EventAggregator,
              private userService: UserService, private tweetDeleter: TweetDeleter) {
    this.tweets = [];
    this.userData = userData;

    this.validationController = vc;
    ValidationRules
      .ensure((t: TweetTimeline) => t.content).required().minLength(1).maxLength(140)
      .on(this);

    be.propertyObserver(this.userData, 'loggedInUser').subscribe(newValue => {
      logger.info('Logged in user changed.');
      this.update();
    })
  }

  attached() {
    this.update();
  }

  private update() {
    if (this.userData && this.userData.loggedInUser) {
      this.updateTimeline([this.userData.loggedInUser]);
      this.updateSelectionFlag();
    }
  }

  public changeTimeline(users: IUser[], timelineDesc: TimeLineDesc) {
    logger.info(`Changeing timeline to: ${timelineDesc.title}`);
    this.updateTimeline(users);
    this.timelineDescription = timelineDesc;
  }

  private updateTimeline(users: IUser[]) {
    logger.info('Updating timeline for users.');
    if (!Array.isArray(users)) {
      return;
    }
    this.tweets = [];
    this.timelineDescription = new TimeLineDesc(true, 'Your Timeline');

    this.addToCurrent(users, null);
  }

  private isTweetOfLoggedInUser(tweet: ITweet) {
    if (!tweet || !tweet.poster || !tweet.poster.id || !this.userData.loggedInUser.id) {
      return false;
    }
    return this.userData.loggedInUser.id === tweet.poster.id;
  }

  private isTweetOfUserFriend(tweet: ITweet) {
    if (!tweet || !tweet.poster || !tweet.poster.id || !this.userData.loggedInUser.following) {
      return false;
    }

    for (const userId of this.userData.loggedInUser.following) {
      if (userId === tweet.poster.id) {
        return true;
      }
    }
    return false;
  }

  public addToCurrent(users: IUser[], newTitle: string) {
    if (!Array.isArray(users)) {
      return;
    }

    for (const user of users) {
      if (user.tweets) {
        for (const tweet of user.tweets) {
          this.tweets.push(new TweetWrapper(tweet, this.isTweetOfLoggedInUser(tweet), this.isTweetOfUserFriend(tweet)))
        }
      }
    }
    this.tweets.sort(TweetTimeline.tweetUpdatedAtComparator);

    if (newTitle) {
      this.timelineDescription.title = newTitle;
    }
  }

  public getSelected() {
    if (!Array.isArray(this.tweets)) {
      return [];
    }
    return this.tweets.filter((tw: TweetWrapper) => {
      return tw.isSelected;
    });
  }

  public deleteAll() {
    this.tweetDeleter.deleteTweets(this.userData.loggedInUser.tweets, true).then(() => {
      this.eventAggregator.publish(new UpdateRequest(this.userData.loggedInUser.id));
    }).catch(err => {
      logger.error('Error while deleting tweets.', err);
    });
  }

  public deleteSelected() {
    const selected: TweetWrapper[] = this.getSelected();
    const tweets: ITweet[] = selected.map((tw:TweetWrapper) => {
      return tw.tweet;
    });
    this.tweetDeleter.deleteTweets(tweets, true).then(() => {
      this.eventAggregator.publish(new UpdateRequest(this.userData.loggedInUser.id));
    }).catch(err => {
      logger.error('Error while deleting tweets.', err);
    });
  }

  public selectCard(tweetWrapper: TweetWrapper) {
    if (!tweetWrapper.isLoggedInUser) {
      return;
    }
    tweetWrapper.invertSelection();
    this.updateSelectionFlag();
  }

  private updateSelectionFlag() {
    const selected = this.getSelected();
    if (selected.length <= 0) {
      this.oneSelected = false;
    } else {
      this.oneSelected = true;
    }
  }

  public removeUser(user: IUser) {
    if (!user || !(Array.isArray(user.tweets))) {
      return;
    }
    this.tweets = this.tweets.filter((tweetWrapper: TweetWrapper) => {
      let notOfUser: boolean = true;
      for (const userTweet of user.tweets) {
        if (userTweet.id === tweetWrapper.tweet.id) {
          notOfUser = false;
        }
      }
      return notOfUser;
    });

    this.tweets.sort(TweetTimeline.tweetUpdatedAtComparator);

    if (this.tweets.length <= 0) {
      this.updateTimeline([this.userData.loggedInUser])
    }
  }

  public toOwnTimeline() {
    this.eventAggregator.publish(new SwitchToFriend(null));
    this.updateTimeline([this.userData.loggedInUser]);
  }

  public static tweetUpdatedAtComparator(tweet1: TweetWrapper, tweet2: TweetWrapper) {
    const date1: number = Date.parse(tweet1.tweet.createdAt);
    const date2: number = Date.parse(tweet2.tweet.createdAt);
    if (isNaN(date1) || isNaN(date2)) {
      logger.warn('Tweet dates could not be parsed to a number', date1, date2);
      return 0;
    }
    return date1 - date2;
  }

  public followUser(user: IUser) {
    if (!user) {
      return;
    }

    const isUserFollowing = this.userData.loggedInUser.following.indexOf(user.id);
    if (isUserFollowing !== -1) {
      logger.warn('User already follows the given user', user.id);
      return;
    }

    this.userData.loggedInUser.following.push(user.id);
    this.userService.updateUser(this.userData.loggedInUser, null).then(() => {
      logger.info('Successfully following friend', user.username);
    }).catch(err => {
      logger.error('Could not follow friend.', err);
    });
  }

  public switchToFriend(friend: IUser) {
    if (friend.id === this.userData.loggedInUser.id) {
      this.updateTimeline([this.userData.loggedInUser]);
      friend = null;
    }

    if (friend) {
      const friendIndex = this.userData.loggedInUser.following.indexOf(friend.id);
      if (friendIndex === -1) {
        const description: TimeLineDesc = new TimeLineDesc(false, `Timeline of: ${friend.username}`);
        this.changeTimeline([friend], description);
      }
    }

    this.eventAggregator.publish(new SwitchToFriend(friend));
  }

  public async createTweet() {
    if (!this.validate()) {
      return;
    }

    let file: File = null;
    if (this.image) {
      file = this.image.item(0);
    }
    const newTweet: ITweet = await this.tweetService.createTweet(file, this.content);
    if (!newTweet) {
      logger.error('Creation of tweet failed');
      this.creationError = 'An unexpected error happened while we created your tweet. Please do some voodoo and try it again.';
      return;
    }
    this.content = '';
    this.image = null;
    this.addTweetToLoggedInUser(newTweet);
  }

  private addTweetToLoggedInUser(tweet: ITweet) {
    this.userData.loggedInUser.tweets.push(tweet);
    this.userService.updateUser(this.userData.loggedInUser, null).then(() => {
      logger.info('Finished updating user.');
    }).catch(err => {
      logger.error('Error during update of user.', err);
    });
  }

  private async validate() {
    try {
      const validationResult = await this.validationController.validate({object: this});
      return validationResult.valid;
    } catch (err) {
      logger.error('Error during tweet validation.', err);
      return false;
    }
  }
}
