import {inject, LogManager, NewInstance} from 'aurelia-framework'
import {ValidationController, ValidationRules} from "aurelia-validation";
import {UserService} from "../../../services/svc/user/userService";

const logger = LogManager.getLogger('Signup');

@inject(NewInstance.of(ValidationController), UserService)
export class Signup {

  signingUp: boolean = false;
  errorMessage: string;

  username: string = '';
  password: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';


  constructor(private controller: ValidationController, private userService: UserService) {
    ValidationRules
      .ensure((s: Signup) => s.username).required().minLength(4)
      .ensure((s: Signup) => s.password).required().minLength(5)
      .ensure((s: Signup) => s.email).required().email()
      .ensure((s: Signup) => s.firstName).required()
      .ensure((s: Signup) => s.lastName).required()
      .on(this);
  }

  async validate() {
    try {
      const result = await this.controller.validate({object: this});
      return result.valid;
    } catch (err){
      logger.warn('Validation failed with error.', err);
      return false;
    }
  }

  signup() {
    this.validate().then(isValid => {
      if(isValid === true) {
        this.signingUp = true;
        this.userService.signUp(this.username, this.email, this.password, this.firstName, this.lastName).catch( err => {
          logger.error('Error during signup process', err);
          if (err && err.message) {
            this.errorMessage = err.message;
          } else {
            this.errorMessage = 'Unknown error during signup process. Please try again later.';
          }
        })
      }
    })
  }

}
