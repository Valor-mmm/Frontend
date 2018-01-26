import {inject, LogManager} from 'aurelia-framework'
import {UserData} from "../../../services/svc/user/userData";
import {EventAggregator} from 'aurelia-event-aggregator';
import {UpdateSuccess} from "../../../services/updateMessages";
import {IUser, User} from "../../../services/svc/user/userUtils";
import {TweetTimeline} from "../tweetTimeline/tweetTimeline";
import {TimeLineDesc} from "../tweetTimeline/timelineDesc";
import {Friend} from "./friend";
import {SwitchToFriend} from "../../../services/timelineMessage";
import {UserService} from "../../../services/svc/user/userService";

const logger = LogManager.getLogger('FriendsSidebar');

@inject(EventAggregator, UserData, TweetTimeline, UserService)
export class FriendsSidebar {

  userData: UserData;
  friends: Friend[] = [];


  constructor(ea: EventAggregator, userData: UserData, private tweetTimeline: TweetTimeline, private userService: UserService) {
    this.userData = userData;

    ea.subscribe(UpdateSuccess, () => {
      this.initFreindList();
    });

    ea.subscribe(SwitchToFriend, switchToFriend => {
      if (!switchToFriend || !switchToFriend.friend) {
        this.deactivateFriends();
        return;
      }
      if (!this.canSwitchToFriend(switchToFriend.friend)) {
        return;
      }
      this.viewTimeline(switchToFriend.friend);
    })
  }

  private deactivateFriends() {
    for (const friend of this.friends) {
      friend.setActive(false);
    }
  }

  private canSwitchToFriend(friend: IUser) {
    const foundFriend = this.getFriend(friend);

    if (!foundFriend || foundFriend.isActive) {
      return false;
    }
    return true;
  }

  private initFreindList() {
    this.friends = [];
    for (const user of this.userData.userFriends) {
      this.friends.push(new Friend(user));
    }
  }

  private getFriend(friend: IUser) {
    const foundFriend = this.friends.find((registeredFriend: Friend) => {
      return registeredFriend.user.id === friend.id;
    });

    if (!foundFriend) {
      return null;
    }
    return foundFriend;
  }

  private isFriendActive(friend: User | Friend) {
    let foundFriend : Friend;
    if (friend instanceof User) {
      foundFriend = this.getFriend(friend);
    } else {
      foundFriend = friend;
    }

    if (!foundFriend) {
      return false;
    }

    return foundFriend.isActive;
  }

  private isAtLeastOneFriendActive() {
    let isActive = false;
    for (const friend of this.friends) {
      if (friend.isActive) {
        isActive = true;
        return isActive;
      }
    }
    return isActive;
  }

  viewTimeline(friend: IUser) {
    if (!friend) {
      return;
    }

    const foundFriend: Friend = this.getFriend(friend);

    if (this.isFriendActive(foundFriend)) {
      this.tweetTimeline.removeUser(friend);
      foundFriend.setActive(false);
      return;
    }


    if (!this.isAtLeastOneFriendActive()) {
      foundFriend.setActive(true);
      const timeLineDesc: TimeLineDesc = new TimeLineDesc(false, `Timeline of ${friend.username}`);
      this.tweetTimeline.changeTimeline([friend], timeLineDesc);
      return;
    }

    foundFriend.setActive(true);
    this.tweetTimeline.addToCurrent([foundFriend.user], 'Timeline of Friends');
  }

  unfollow(friend: IUser) {
    if (!friend) {
      return;
    }

    const friendIndex = this.userData.loggedInUser.following.indexOf(friend.id);
    this.userData.loggedInUser.following.splice(friendIndex, 1);

    this.userService.updateUser(this.userData.loggedInUser, false).then(updateResult => {
      logger.info('Received update result.')
    }).catch(err => {
      logger.error('Error while unfollowing friend.', err)
    });
  }

  displayFirehose() {
    this.initFreindList();
    const timeLineDesc: TimeLineDesc = new TimeLineDesc(false, 'Firehose');
    this.tweetTimeline.changeTimeline(this.userData.allUsers, timeLineDesc);
  }

}
