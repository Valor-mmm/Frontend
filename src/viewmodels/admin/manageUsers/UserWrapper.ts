import {IUser} from "../../../services/svc/user/userUtils";

export class UserWrapper {

  user: IUser;
  isSelected: boolean;

  constructor(user: IUser) {
    this.user = user;
    this.isSelected = false;
  }
}
