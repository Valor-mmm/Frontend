import {inject, LogManager} from 'aurelia-framework';
import {ITweet} from "../../../services/svc/tweet/tweetUtils";
import {UserData} from "../../../services/svc/user/userData";
import {IUser} from "../../../services/svc/user/userUtils";
import {BindingEngine} from 'aurelia-binding';
import {TimeLineDesc} from "./timelineDesc";
import {ValidationController, ValidationRules} from "aurelia-validation";
import {TweetService} from "../../../services/svc/tweet/tweetService";
import {ImageService} from "../../../services/svc/imageService";

const logger = LogManager.getLogger('TweetTimeline');

@inject(UserData, BindingEngine, ValidationController, TweetService, ImageService)
export class TweetTimeline {

  tweets: ITweet[];
  userData: UserData;
  timelineDescription: TimeLineDesc;

  content: string;
  image: FileList;
  validationController: ValidationController;
  creationError: string;


  constructor(userData: UserData, be: BindingEngine, vc: ValidationController, private tweetService: TweetService, private imageService: ImageService) {
    this.tweets = [];
    this.userData = userData;

    this.validationController = vc;
    ValidationRules
      .ensure((t:TweetTimeline) => t.content).required().minLength(1).maxLength(140)
      .on(this);

    be.propertyObserver(this.userData, 'loggedInUser').subscribe(newValue => {
      logger.info('Logged in user changed.');
      if (this.userData && this.userData.loggedInUser) {
        this.updateTimeline([this.userData.loggedInUser]);
      }
    })
  }

  public changeTimeline(users: IUser[], timelineDesc: TimeLineDesc) {
    logger.info(`Changeing timeline to: ${timelineDesc.title}`);
    this.updateTimeline(users);
    this.timelineDescription = timelineDesc;
  }

  private updateTimeline(users: IUser[]) {
    logger.info('Updating timeline for users.');
    if (!users) {
      return;
    }
    this.tweets = [];
    this.timelineDescription = new TimeLineDesc(true, 'Your Timeline');

    for (const user of users) {
      if (user.tweets) {
        this.tweets = this.tweets.concat(user.tweets);
      }
    }
    this.tweets.sort(TweetTimeline.tweetUpdatedAtComparator);

  }

  public toOwnTimeline() {
    this.updateTimeline([this.userData.loggedInUser]);
  }

  public getImgUrlForTweet(tweet: ITweet) {
    if (!tweet.image) {
      return '';
    }

    this.imageService.getUrlForImageId(tweet.image).then(url => {
      return url;
    }).catch(err => {
      logger.error('Error during fetch of image url for public id: ' + tweet.image);
      return '';
    })
  }

  public static tweetUpdatedAtComparator(tweet1: ITweet, tweet2: ITweet) {
    const date1: number = Date.parse(tweet1.createdAt);
    const date2: number = Date.parse(tweet2.createdAt);
    if (isNaN(date1) || isNaN(date2)) {
      logger.warn('Tweet dates could not be parsed to a number', date1, date2);
      return 0;
    }
    return date1 - date2;
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
    this.addTweetToLoggedInUser(newTweet);
  }

  private addTweetToLoggedInUser(tweet: ITweet) {
    this.userData.loggedInUser.tweets.push(tweet);
    for (const user of this.userData.allUsers) {
      if (user.id === this.userData.loggedInUser.id) {
        user.tweets.push(tweet);
      }
    }

    if (this.timelineDescription.isLoggedInUser) {
      this.toOwnTimeline();
    }
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
