import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FetchClient} from '../../FetchClient';
import FetchConfig from '../../fetchConfigLocal'
import {AuthRole, LoginMessage} from "../../authMessages";
import {UserService} from "../user/userService";
import {AdminData} from "./adminData";

const logger = LogManager.getLogger('AdminService');

@inject(EventAggregator, FetchClient, FetchConfig, UserService, AdminData)
export class AdminService {

  fetchClient: FetchClient;
  eventAggregator: EventAggregator;
  fetchConfig: FetchConfig;


  constructor(ea: EventAggregator, fetchClient: FetchClient, fetchConfig: FetchConfig, private userService: UserService,
              private adminData: AdminData) {
    this.eventAggregator = ea;
    this.fetchClient = fetchClient;
    this.fetchConfig = fetchConfig;
  }

  async authenticate(username: string, password: string) {
    const authBody = {
      username: username,
      password: password
    };

    const authUrl = this.fetchConfig.adminsPart + this.fetchConfig.authPart;

    this.fetchClient.postJSON(authUrl, authBody).then(authResult => {
      if (authResult.success && authResult.token) {
        FetchClient.setAuthToken(authResult.token);
        this.userService.getUsersById([]).then(users => {
          this.adminData.allUsers = users;
        });
        this.eventAggregator.publish(new LoginMessage(AuthRole.ADMIN, true));
      } else {
        const loginEvent = new LoginMessage(AuthRole.ADMIN, false);
        if (authResult.message) {
          loginEvent.message = authResult.message;
        }
        this.eventAggregator.publish(loginEvent);
        throw loginEvent;
      }
    }).catch(err => {
      if (err) {
        logger.error('Error during authentication', err);
      }
      const loginEvent = new LoginMessage(AuthRole.ADMIN, false);
      if (err.message) {
        loginEvent.message = err.message;
      }

      this.eventAggregator.publish(loginEvent);
      if (err) {
        throw err;
      }
    })
  }

}
