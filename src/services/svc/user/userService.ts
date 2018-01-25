import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator'
import {FetchClient} from "../../FetchClient";
import FetchConfig from "../../fetchConfigLocal";
import {AuthRole, LoginMessage} from "../../authMessages";
import {IUser, UserUtils} from "./userUtils";
import {TweetService} from "../tweet/tweetService";
import {ITweet} from "../tweet/tweetUtils";
import {UpdateRequest} from "../../updateMessages";

const logger = LogManager.getLogger('UserService');

@inject(EventAggregator, FetchClient, FetchConfig, TweetService)
export class UserService {

  eventAggregator: EventAggregator;
  fetchClient: FetchClient;
  fetchConfig: FetchConfig;

  constructor(ea: EventAggregator, fetchClient: FetchClient, fetchConfig: FetchConfig, private tweetService: TweetService) {
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
      const authResult = await this.fetchClient.postJSON(authUrl, authBody);
      if (authResult.success && authResult.token) {
        this.handleAuthSuccess(authResult);
      } else {
        const loginEvent = new LoginMessage(AuthRole.USER, false);
        if (authResult.message) {
          loginEvent.message = authResult.message;
        }
        this.eventAggregator.publish(loginEvent);
      }
    } catch (err) {
      this.handleAuthError(err);
    }
  }

  handleAuthSuccess(authResult) {
    FetchClient.setAuthToken(authResult.token);
    const loginMessage = new LoginMessage(AuthRole.USER, true);
    if (authResult) {
      loginMessage.id = authResult.id;
    }
    this.eventAggregator.publish(loginMessage);
  }

  handleAuthError(err) {
    if (err) {
      logger.error('Error during authentication', err);
    }
    const loginEvent = new LoginMessage(AuthRole.USER, false);
    if (err.message) {
      loginEvent.message = err.message;
    }

    this.eventAggregator.publish(loginEvent);
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
      await this.fetchClient.postJSON(this.fetchConfig.usersPart, signupBody);

      await this.authenticate(email, password);
      return true;
    } catch (exception) {
      logger.error('Exception during signup.', exception);
      throw exception;
    }
  }

  async getUserById(id: string) {
    try {
      const plainUser = await this.fetchClient.get(`${this.fetchConfig.usersPart}/${id}`, null);
      const user: IUser = await this.populateTweets(plainUser);
      return user;
    } catch (error) {
      logger.error('Error during fetch of user.', error);
      throw error;
    }
  }

  async getUsersById(ids: string[]) {
    try {
      const plainUsers = await this.fetchClient.get(this.fetchConfig.usersPart, {ids: ids});
      if (!Array.isArray(plainUsers)) {
        logger.error('Fetched user array is no array.');
        return null;
      }
      let users: IUser[];
      const populationPromise: Promise<IUser>[] = [];
      for (const plainUser of plainUsers) {
        populationPromise.push(this.populateTweets(plainUser));
      }
      users = await Promise.all(populationPromise);
      return users;
    } catch (err) {
      logger.error('Could not fetch users by id', err);
      return null;
    }
  }

  async updateUser(user: IUser, preventDataUpdate: boolean) {
    if (!user) {
      return;
    }
    const id = JSON.parse(JSON.stringify(user.id));
    const toUpdate = UserUtils.mapFromUser(user);
    try {
      const updateResult = await this.fetchClient.put(`${this.fetchConfig.usersPart}/${id}`, toUpdate);
      if (!preventDataUpdate) {
        this.eventAggregator.publish(new UpdateRequest(id));
      }
      return true;
    } catch (err) {
      logger.error('Error during update of user', err);
      return false;
    }
  }

  async populateTweets(plainUser: any) {
    if (!plainUser || !(Array.isArray(plainUser.tweets))) {
      const errMsg = 'User does not contain required tweet-id array.';
      logger.error(errMsg);
      throw errMsg;
    }

    const user: IUser = UserUtils.mapToUser(plainUser);
    let tweets: ITweet[] = [];
    if (plainUser.tweets.length > 0) {
      tweets = await this.tweetService.getTweetsById(plainUser.tweets);
      for (const tweet of tweets) {
        tweet.poster = user;
      }
    }

    user.tweets = tweets;
    return user;
  }
}
