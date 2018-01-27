import {inject} from "aurelia-framework";
import {UserService} from "../../../services/svc/user/userService";
import {BindingEngine} from 'aurelia-binding';
import {AdminData} from "../../../services/svc/admin/adminData";
import {UserDeleter} from "../../../services/svc/user/userDeleter";
import {IUser} from "../../../services/svc/user/userUtils";
import {UpdateService} from "../../../services/svc/user/updateService";

@inject(AdminData, UserService, BindingEngine, UserDeleter, UpdateService)
export class ManageUsers {

  users: IUser[];
  selectedUsers: IUser[];


  constructor(private adminData: AdminData, private userService: UserService, be: BindingEngine,
              private userDeleter: UserDeleter, private updateService: UpdateService) {

    be.propertyObserver(this.adminData, 'allUsers').subscribe(this.update.bind(this));
    this.update();
  }

  attached() {
    this.update();
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

  public createUser() {

  }

}
