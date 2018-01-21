import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator'
import {FetchClient} from "../FetchClient";
import FetchConfig from "../fetchConfigLocal";
import {AuthRole, LoginMessage} from "../authMessages";

const logger = LogManager.getLogger('UserService');

@inject(EventAggregator, FetchClient, FetchConfig)
export class UserService {

  eventAggregator: EventAggregator;
  fetchClient: FetchClient;
  fetchConfig: FetchConfig;

  constructor(ea: EventAggregator, fetchClient: FetchClient, fetchConfig: FetchConfig) {
    this.eventAggregator = ea;
    this.fetchClient = fetchClient;
    this.fetchConfig = fetchConfig;
  }

  async authenticate(email, password) {
    const authBody = {
      email: email,
      password: password
    };

    const authUrl = this.fetchConfig.usersPart + this.fetchConfig.authPart;

    try {
      const authResult = await this.fetchClient.post(authUrl, authBody);
      if (authResult.success && authResult.token) {
        FetchClient.setAuthToken(authResult.token);
        this.eventAggregator.publish(new LoginMessage(AuthRole.ADMIN, true));
      } else {
        const loginEvent = new LoginMessage(AuthRole.USER, false);
        if (authResult.message) {
          loginEvent.message = authResult.message;
        }
      }
    } catch (err) {
      if (err) {
        logger.error('Error during authentication', err);
      }
      const loginEvent = new LoginMessage(AuthRole.USER, false);
      if (err.message) {
        loginEvent.message = err.message;
      }

      this.eventAggregator.publish(loginEvent);
    }
  }
}
