import {inject, LogManager} from "aurelia-framework";
import {UserService} from "../../../services/svc/user/userService";
import {BindingEngine} from 'aurelia-binding';
import {AdminData} from "../../../services/svc/admin/adminData";
import {UserDeleter} from "../../../services/svc/user/userDeleter";
import {IUser} from "../../../services/svc/user/userUtils";
import {UpdateService} from "../../../services/svc/user/updateService";
import {Signup} from "../../start/signup/signup";
import {ValidationController, ValidationRules} from "aurelia-validation";

const logger = LogManager.getLogger('ManageUsers');

@inject(AdminData, UserService, BindingEngine, UserDeleter, UpdateService, ValidationController)
export class ManageUsers {

  users: IUser[];
  selectedUsers: IUser[];

  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;


  constructor(private adminData: AdminData, private userService: UserService, be: BindingEngine,
              private userDeleter: UserDeleter, private updateService: UpdateService, private controller: ValidationController) {

    ValidationRules
      .ensure((s: Signup) => s.username).required().minLength(4)
      .ensure((s: Signup) => s.password).required().minLength(5)
      .ensure((s: Signup) => s.email).required().email()
      .ensure((s: Signup) => s.firstName).required()
      .ensure((s: Signup) => s.lastName).required()
      .on(this);

    be.propertyObserver(this.adminData, 'allUsers').subscribe(this.update.bind(this));
    this.update();
  }

  attached() {
    this.update();
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

  private update() {

    if (!this.adminData || !Array.isArray(this.adminData.allUsers)) {
      return;
    }
    this.users = this.adminData.allUsers;
    this.selectedUsers = [];

  }

  public async deleteUsers() {
    if (this.selectedUsers.length <= 0) {
      return;
    }

    try {
      await this.userDeleter.deleteUser(this.selectedUsers);
      await this.updateService.updateAdminData();
    } catch (error) {
      throw error;
    }
  }

  public async createUser() {
    const valid = await this.validate();
    if (!valid) {
      return;
    }

    try {
      await this.userService.signUp(this.username, this.email, this.password, this.firstName, this.lastName, false);
      await this.updateService.updateAdminData();
      this.username = '';
      this.email = '';
      this.password = '';
      this.firstName = '';
      this.lastName = '';
    } catch (error) {
      logger.error('Error during creation of user.');
    }

  }

}
