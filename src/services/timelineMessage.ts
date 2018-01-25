import {IUser} from "./svc/user/userUtils";

export class SwitchToFriend {

  friend: IUser;

  constructor(friend: IUser) {
    this.friend = friend;
  }

}
