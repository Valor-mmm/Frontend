import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginMessage} from "../../services/authMessages";
import {UserData} from "../../services/svc/user/userData";
import {AdminData} from "../../services/svc/admin/adminData";

@inject(EventAggregator, UserData, AdminData)
export class Logout {

  eventAggregator: EventAggregator;

  constructor(ea: EventAggregator, private userData: UserData, private adminData: AdminData) {
    this.eventAggregator = ea;
  }

  logout() {
    this.adminData.allUsers = null;
    this.userData.loggedInUser = null;
    this.userData.userFriends = null;
    this.userData.allUsers = null;
    this.eventAggregator.publish(new LoginMessage(null, false, false));
  }

}
