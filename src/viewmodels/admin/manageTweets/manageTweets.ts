import {inject, LogManager} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {AdminData} from "../../../services/svc/admin/adminData";
import {TweetDeleter} from "../../../services/svc/tweet/tweetDeleter";
import {UpdateService} from "../../../services/svc/user/updateService";
import {ITweet} from "../../../services/svc/tweet/tweetUtils";

const logger = LogManager.getLogger('ManageTweets');

@inject(AdminData, TweetDeleter, UpdateService, BindingEngine)
export class ManageTweets {

  tweets: ITweet[];
  selectedTweets: ITweet[];

  constructor(private adminData: AdminData, private tweetDeleter: TweetDeleter, private updateService: UpdateService,
              be: BindingEngine) {

    be.propertyObserver(this.adminData, 'allUsers').subscribe(() => {
      this.update();
    });
  }

  attached() {
    this.update();
  }

  private update() {
    if (!this.adminData || ! Array.isArray(this.adminData.allUsers)) {
      return;
    }

    this.tweets = [];
    this.selectedTweets = [];
    for (const user of this.adminData.allUsers) {
      this.tweets = this.tweets.concat(user.tweets);
    }
  }

  public async deleteTweets() {
    if (!Array.isArray(this.selectedTweets) || this.selectedTweets.length <= 0) {
      return;
    }

    try {
      await this.tweetDeleter.deleteTweets(this.selectedTweets, true);
      await this.updateService.updateAdminData();
    } catch (err) {
      logger.error('Error during tweet deletion.', err);
    }
  }

}
