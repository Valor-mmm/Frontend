import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FetchClient} from '../../FetchClient';
import FetchConfig from '../../fetchConfigLocal'
import {AuthRole, LoginMessage} from "../../authMessages";
import {UserService} from "../user/userService";
import {AdminData} from "./adminData";
import {UpdateService} from "../user/updateService";

const logger = LogManager.getLogger('AdminService');

@inject(EventAggregator, FetchClient, FetchConfig, UserService, AdminData, UpdateService)
export class AdminService {

  fetchClient: FetchClient;
  eventAggregator: EventAggregator;
  fetchConfig: FetchConfig;


  constructor(ea: EventAggregator, fetchClient: FetchClient, fetchConfig: FetchConfig, private userService: UserService,
              private adminData: AdminData, private updateService: UpdateService) {
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
        this.updateService.updateAdminData().then(() => {
          logger.info('Updated all users for admin data');
        });
        this.eventAggregator.publish(new LoginMessage(AuthRole.ADMIN, true, false));
      } else {
        const loginEvent = new LoginMessage(AuthRole.ADMIN, false, true);
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
      const loginEvent = new LoginMessage(AuthRole.ADMIN, false, true);
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
