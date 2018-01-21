import {inject, NewInstance, LogManager} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationRules, ValidationController, validateTrigger} from "aurelia-validation";
import {UserService} from "../../../services/svc/userService";

const logger = LogManager.getLogger('NotLoggedIn');

@inject(NewInstance.of(ValidationController), EventAggregator, UserService)
export class NotLoggedIn {

  email: string = '';
  password: string = '';

  eventAggregator: EventAggregator;
  userService: UserService;
  controller: ValidationController;

  constructor(vc: ValidationController, ea: EventAggregator, userService: UserService) {
    this.controller = vc;
    this.eventAggregator = ea;
    this.userService = userService;

    this.controller.validateTrigger = validateTrigger.blur;
    ValidationRules
      .ensure((v: NotLoggedIn) => v.email).required().email()
      .ensure((v: NotLoggedIn) => v.password).required().minLength(5)
      .on(this);
  }

  async validate() {
    try {
      const result = await this.controller.validate({object: this});
      return result.valid;
    } catch (err) {
      logger.error('Error during validation', err);
      return false;
    }
  }

  login() {
    this.validate().then(isValid => {
      if (isValid) {
        this.userService.authenticate(this.email, this.password);
      }
    });
  }

}
