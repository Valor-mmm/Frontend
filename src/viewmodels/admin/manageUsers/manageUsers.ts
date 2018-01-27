import {inject} from "aurelia-framework";
import {UserService} from "../../../services/svc/user/userService";
import {BindingEngine} from 'aurelia-binding';
import {AdminData} from "../../../services/svc/admin/adminData";
import {UserWrapper} from "./UserWrapper";

@inject(AdminData, UserService, BindingEngine)
export class ManageUsers {

  users: UserWrapper[];


  constructor(private adminData: AdminData, private userService: UserService, be: BindingEngine) {

    be.propertyObserver(this.adminData, 'allUsers').subscribe(this.update.bind(this));
    this.update();
  }

  private update() {

    if (!this.adminData || !Array.isArray(this.adminData.allUsers)) {
      return;
    }
    this.users = [];
    for (const user of this.adminData.allUsers) {
      this.users.push(new UserWrapper(user))
    }

  }

  public getSelected() {
    let selected = this.users.filter( (user: UserWrapper) => {
      return user.isSelected;
    });

    if (!selected) {
      selected= [];
    }
    return selected
  }

  public deleteUsers() {

  }

  public createUser() {
    
  }

}
