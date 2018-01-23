import {inject, LogManager} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import FetchConfig from "./fetchConfigLocal";
import {buildQueryString} from 'aurelia-path';

const logger = LogManager.getLogger('FetchClient');

export class QueryObject {
  name: string;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

@inject(HttpClient, FetchConfig)
export class FetchClient {

  fetchClient: HttpClient;
  static authToken?: string;

  constructor(client: HttpClient, fetchConfig: FetchConfig) {
    this.fetchClient = client;
    this.fetchClient.configure(config => {
      config.withBaseUrl(fetchConfig.baseUrl)
        .withDefaults({
          mode: 'cors'
        }).withInterceptor({
        request(request: Request) {

          // null or undefined
          if (FetchClient.authToken != null) {
            request.headers.append('Authorization', `Bearer ${FetchClient.authToken}`);
          }
          return request;
        },
      })
    })
  }


  static setAuthToken(token: string) {
    FetchClient.authToken = token;
  }


  async post(targetUrl, object) {
    FetchClient.logRequestStart(targetUrl);
    const fetchResult: Response = await this.fetchClient.fetch(targetUrl, {
      method: 'post',
      body: json(object)
    });

    if (!fetchResult.ok) {
      await this.handleNotOkResponse(fetchResult);
    }

    const jsonResponse = await fetchResult.json();
    FetchClient.logSuccess(targetUrl, fetchResult.status);
    return jsonResponse;
  }


  async get(targetUrl, query: any) {

    const fetchResult: Response = await this.fetchClient.fetch(targetUrl + (query ? `?${buildQueryString(query)}` : ''));

    if (!fetchResult.ok) {
      this.handleNotOkResponse(fetchResult);
    }

    const result = await fetchResult.json();
    FetchClient.logSuccess(targetUrl, fetchResult.status);
    return result;
  }


  async handleNotOkResponse(response: Response) {

  }


  static logRequestStart(url: string) {
    logger.info(`Started request to: [${url}]`);
  }


  static logSuccess(url: string, status: number) {
    logger.info(`Received valid response for url: [${url}] status: [${status}]`)
  }

}
