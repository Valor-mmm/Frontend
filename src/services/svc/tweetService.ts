import {inject, LogManager} from 'aurelia-framework';
import {FetchClient} from "../FetchClient";
import FetchConfig from "../fetchConfigLocal";

const logger = LogManager.getLogger('TweetService')


export interface ITweet {

}

@inject(FetchClient, FetchConfig)
export class TweetService {

  fetchClient: FetchClient;
  fetchConfig: FetchConfig;

  constructor(fetchClient: FetchClient, fetchConfig: FetchConfig) {
    this.fetchClient = fetchClient;
    this.fetchConfig = fetchConfig;
  }
}
