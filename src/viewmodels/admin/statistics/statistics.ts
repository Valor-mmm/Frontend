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
      this.update();
    });
  }

  attached() {
    this.update();
  }

  private update() {
    if (! this.adminData || !Array.isArray(this.adminData.allUsers)) {
      return;
    }

    this.userNumber = this.adminData.allUsers.length;

    let tweets = 0;
    let following = 0;

    for (const user of this.adminData.allUsers) {
      tweets += user.tweets.length;
      following += user.following.length;
    }

    this.followingNumber = following;
    this.tweetNumber = tweets;
  }

}
