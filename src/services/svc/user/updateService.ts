import {inject, LogManager} from 'aurelia-framework';
import {UserService} from "./userService";
import {TweetService} from "../tweet/tweetService";
import {UserData} from "./userData";
import {EventAggregator} from 'aurelia-event-aggregator';
import {UpdateRequest, UpdateSuccess} from "../../updateMessages";
import {AdminData} from "../admin/adminData";

const logger = LogManager.getLogger('UpdateService');

@inject(UserService, TweetService, UserData, EventAggregator, AdminData)
export class UpdateService {

  userData: UserData;

  constructor(private userService: UserService, private TweetService: TweetService, userData: UserData,
              private ea: EventAggregator, private adminData: AdminData) {
    this.userData = userData;

    ea.subscribe(UpdateRequest, (request: UpdateRequest) => {
      if (request && request.id) {
        this.fetchUserData(request.id).then(() => {
          logger.info('Update successfull');
        }).catch(err => {
          logger.error('Error during update', err);
        });
      }
    })
  }

  async fetchUserData(id: string) {
    try {
      this.userData.loggedInUser = await this.userService.getUserById(id);
      this.loadAllUsers().then(() => {
        logger.info('Loaded all users.')
      }).catch(err => {
        logger.error('Error on all users update.', err);
      });
      this.userData.userFriends = [];
      if (this.userData.loggedInUser.following.length > 0) {
        this.userData.userFriends = await this.userService.getUsersById(this.userData.loggedInUser.following);
      }
      this.ea.publish(new UpdateSuccess());
      logger.info('Finished fetching user data.');
    } catch (err) {
      logger.error("Error during user data fetch.", err);
    }
  }

  /**
   * Potential performance liability
   * Implement paging after over 50-100 users
   */
  async loadAllUsers() {
    logger.info('Started loading all users.');
    console.time('fetchAllUsers');
    try {
      this.userData.allUsers = await this.userService.getUsersById(null);
    } catch (error) {
      logger.error('Error during fetch of all users.', error);
      throw error;
    } finally {
      console.timeEnd('fetchAllUsers');
      logger.info('Finished loading all users;');
    }
  }

  async updateAdminData() {
    logger.info('Started loading all users.');
    console.time('updateAdmin');
    try {
      this.adminData.allUsers = await this.userService.getUsersById(null);
    } catch (error) {
      logger.error('Error during fetch of all users.', error);
      throw error;
    } finally {
      console.timeEnd('updateAdmin');
      logger.info('Finished loading all users;');
    }
  }
}
