import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator'
import {FetchClient} from "../../FetchClient";
import FetchConfig from "../../fetchConfigLocal";
import {AuthRole, LoginMessage} from "../../authMessages";

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
        this.eventAggregator.publish(new LoginMessage(AuthRole.USER, true));
      } else {
        const loginEvent = new LoginMessage(AuthRole.USER, false);
        if (authResult.message) {
          loginEvent.message = authResult.message;
        }
        this.eventAggregator.publish(loginEvent);
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

  async signUp(username: string, email: string, password: string, firstName: string, lastName: string) {
    const signupBody = {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    };

    try {
      await this.fetchClient.post(this.fetchConfig.usersPart, signupBody);

      await this.authenticate(email, password);
      return true;
    } catch (exception) {
      logger.error('Exception during signup.', exception);
      throw exception;
    }
  }
}
