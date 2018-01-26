import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginMessage} from "../../services/authMessages";
import {UserData} from "../../services/svc/user/userData";

@inject(EventAggregator, UserData)
export class Logout {

  eventAggregator: EventAggregator;

  constructor(ea: EventAggregator, private userData: UserData) {
    this.eventAggregator = ea;
  }

  logout() {
    this.userData.loggedInUser = null;
    this.userData.userFriends = null;
    this.userData.allUsers = null;
    this.eventAggregator.publish(new LoginMessage(null, false));
  }

}
