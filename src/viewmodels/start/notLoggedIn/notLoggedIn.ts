import {inject, NewInstance, LogManager} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationRules, ValidationController, validateTrigger} from "aurelia-validation";
import {UserService} from "../../../services/svc/user/userService";
import {FailedLogin} from "../../../services/authMessages";

const logger = LogManager.getLogger('NotLoggedIn');

@inject(NewInstance.of(ValidationController), EventAggregator, UserService)
export class NotLoggedIn {

  email: string = '';
  password: string = '';
  errorMessage: string;

  userService: UserService;
  controller: ValidationController;

  constructor(vc: ValidationController, ea: EventAggregator, userService: UserService) {
    this.controller = vc;
    this.userService = userService;

    ea.subscribe(FailedLogin, (result: FailedLogin) => {
      if (!result) {
        return;
      }
      if (result.message) {
        this.errorMessage = result.message;
      } else {
        this.errorMessage = 'Unknown error during login. Please try again later.'
      }
    });

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
