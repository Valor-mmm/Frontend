import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginMessage} from "../../services/authMessages";

@inject(EventAggregator)
export class Logout {

  eventAggregator: EventAggregator;

  constructor(ea: EventAggregator) {
    this.eventAggregator = ea;
  }

  logout() {
    this.eventAggregator.publish(new LoginMessage(null, false));
  }

}
