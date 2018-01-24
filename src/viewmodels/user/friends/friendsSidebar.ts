import {inject, LogManager} from 'aurelia-framework'
import {UserData} from "../../../services/svc/user/userData";
import {EventAggregator} from 'aurelia-event-aggregator';
import {UpdateSuccess} from "../../../services/updateMessages";
import {IUser} from "../../../services/svc/user/userUtils";
import {TweetTimeline} from "../tweetTimeline/tweetTimeline";
import {TimeLineDesc} from "../tweetTimeline/timelineDesc";

const logger = LogManager.getLogger('FriendsSidebar');

@inject(EventAggregator, UserData, TweetTimeline)
export class FriendsSidebar {

  userData: UserData;
  friends: IUser[];
  activeFriend: IUser;

  constructor(ea: EventAggregator, userData: UserData, private tweetTimeline: TweetTimeline) {
    this.userData = userData;

    ea.subscribe(UpdateSuccess, () => {
      this.friends = this.userData.userFriends;
      this.activeFriend = null;
    });
  }

  isFriendActive(friend: IUser) {
    if (!friend) {
      return false;
    }
    return this.activeFriend.id === friend.id;
  }

  viewTimeline(friend: IUser) {
    if (!friend) {
      return;
    }
    this.activeFriend = friend;
    const timeLineDesc: TimeLineDesc = new TimeLineDesc(false, `Timeline of ${friend.username}`);
    this.tweetTimeline.changeTimeline([friend], timeLineDesc);
  }

  unfollow(firend: IUser) {
    // TODO
  }

}
