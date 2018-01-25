import {observable} from 'aurelia-framework';
import {IUser} from "../../../services/svc/user/userUtils";

export class Friend {

  defaultFriendStyle: string = "ui label";

  @observable()
  styleClass: string;

  @observable()
  user: IUser;

  @observable()
  isActive: boolean;

  constructor(user: IUser) {
    this.user = user;
    this.styleClass = this.defaultFriendStyle;
    this.isActive = false;
  }

  public setActive(status: boolean) {
    this.isActive = status;
    if (status) {
      this.styleClass = 'ui teal label';
    } else {
      this.styleClass = this.defaultFriendStyle;
    }
  }
}
