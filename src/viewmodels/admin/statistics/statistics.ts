import {inject, LogManager} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {AdminData} from "../../../services/svc/admin/adminData";

@inject(BindingEngine, AdminData)
export class Statistics {

  userNumber: number;

  followingNumber: number;

  tweetNumber: number;

  constructor(be: BindingEngine, private adminData: AdminData) {

    be.propertyObserver(this.adminData, 'allUsers').subscribe(() => {

      this.userNumber = this.adminData.allUsers.length;

      let tweets = 0;
      let following = 0;

      for (const user of this.adminData.allUsers) {
        tweets += user.tweets.length;
        following += user.following.length;
      }

      this.followingNumber = following;
      this.tweetNumber = tweets;

    });
  }

}
