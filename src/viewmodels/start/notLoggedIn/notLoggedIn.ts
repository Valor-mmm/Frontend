import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {AuthRole, LoginMessage} from "../../../services/authMessages";
import {UserService} from "../../../services/svc/userService";


@inject(EventAggregator, UserService)
export class NotLoggedIn {

  email: string;
  password: string;

  eventAggregator: EventAggregator;
  userService: UserService;

  constructor(ea: EventAggregator, userService: UserService) {
    this.eventAggregator = ea;
    this.userService = userService;
  }

  login() {
    this.userService.authenticate(this.email, this.password);
  }

}
