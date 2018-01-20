import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {AuthRole, LoginMessage} from "../../../services/authMessages";

@inject(EventAggregator)
export class LoginAdmin {

  eventAggregator: EventAggregator;

  constructor(ea: EventAggregator) {
    this.eventAggregator = ea;
  }

  login() {
    this.eventAggregator.publish(new LoginMessage(AuthRole.ADMIN, true));
  }

}