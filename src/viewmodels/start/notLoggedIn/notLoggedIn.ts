import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {AuthRole, LoginMessage} from "../../../services/authMessages";
import {UserService} from "../../../services/svc/userService";


@inject(EventAggregator, UserService)
export class NotLoggedIn {

  eventAggregator: EventAggregator;
  userService: UserService;

  constructor(ea: EventAggregator, userService: UserService) {
    this.eventAggregator = ea;
    this.userService = userService;
  }

  login() {
    this.userService.authenticate('maximum.effort@dp.com', 'francis')
    //this.eventAggregator.publish(new LoginMessage(AuthRole.USER, true));
  }

}
