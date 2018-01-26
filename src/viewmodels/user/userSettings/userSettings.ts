import {inject, LogManager} from 'aurelia-framework';
import {ValidationRules, ValidationController} from "aurelia-validation";
import {UserService} from "../../../services/svc/user/userService";
import {UserData} from "../../../services/svc/user/userData";
import {BindingEngine} from 'aurelia-binding';
import {TweetTimeline} from "../tweetTimeline/tweetTimeline";

const logger = LogManager.getLogger('UserSettings');

@inject(UserData, UserService, BindingEngine, TweetTimeline, ValidationController)
export class UserSettings {

  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;

  successMessage: string;
  errorMessage: string;

  controller: ValidationController;

  constructor(private userData: UserData, private userService: UserService, private bindingEngine: BindingEngine,
              private tweetTimeline: TweetTimeline, vc: ValidationController) {
    this.controller = vc;

    bindingEngine.propertyObserver(this.userData, 'loggedInUser').subscribe(newValue => {
      this.updateData();
    });

    if (this.userData.loggedInUser) {
      this.updateData();
    }

    ValidationRules
      .ensure((s: UserSettings) => s.username).required().minLength(4)
      .ensure((s: UserSettings) => s.password).required().minLength(5)
      .ensure((s: UserSettings) => s.email).required().email()
      .ensure((s: UserSettings) => s.firstName).required()
      .ensure((s: UserSettings) => s.lastName).required()
      .on(this);
  }

  private updateData() {
    this.username = this.userData.loggedInUser.username;
    this.password = this.userData.loggedInUser.password;
    this.email = this.userData.loggedInUser.email;
    this.firstName = this.userData.loggedInUser.firstName;
    this.lastName = this.userData.loggedInUser.lastName;
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

  public async update() {
    const valid = await this.validate();
    if (!valid) {
      return;
    }
    this.executeUpdate();
  }

  public executeUpdate() {
    const user = this.userData.loggedInUser;
    user.username = this.username;
    user.password = this.password;
    user.email = this.email;
    user.firstName = this.firstName;
    user.lastName = this.lastName;

    this.userService.updateUser(user, false).then(() => {
      logger.info('Successfully updated user.');
      this.successMessage = 'Update was successful.';
        this.tweetTimeline.toOwnTimeline();
    }).catch(err => {
      logger.error('Error updating user.', err);
      this.successMessage = null;
      this.errorMessage = 'An error happened during saving your changes.'
    });
  }


}
