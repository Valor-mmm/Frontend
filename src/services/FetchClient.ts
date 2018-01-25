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


  async postJSON(targetUrl, object) {
    return this.sendPost(targetUrl, json(object))
  }

  async postForm(targetUrl, formData: FormData) {
    return this.sendPost(targetUrl, formData);
  }

  private async sendPost(targetUrl, body) {
    FetchClient.logRequestStart(targetUrl);

    const fetchResult: Response = await this.fetchClient.fetch(targetUrl, {
      method: 'post',
      body: body
    });

    if (!fetchResult.ok) {
      await this.handleNotOkResponse(fetchResult);
    }

    const jsonResponse = await fetchResult.json();
    FetchClient.logSuccess(targetUrl, fetchResult.status);
    return jsonResponse;
  }


  async getText(targetUrl, query: any) {
    FetchClient.logRequestStart(targetUrl);
    const fetchResult: Response = await this.sendGet(targetUrl, query);

    let result;
    try {
      result = await fetchResult.text();
    } catch (error){
      logger.error('Could not fetch result as text', fetchResult, error);
      throw error;
    }
    FetchClient.logSuccess(targetUrl, fetchResult.status);
    return result;
  }


  async get(targetUrl, query: any) {
    FetchClient.logRequestStart(targetUrl);
    const fetchResult: Response = await this.sendGet(targetUrl, query);

    let result;
    try {
      result = await fetchResult.json();
    } catch (error){
      logger.error('Could not fetch result as json', fetchResult, error);
      throw error;
    }
    FetchClient.logSuccess(targetUrl, fetchResult.status);
    return result;
  }

  async sendGet(targetUrl: string, query:any) {
    const fetchResult: Response = await this.fetchClient.fetch(targetUrl + (query ? `?${buildQueryString(query)}` : ''));

    if (!fetchResult.ok) {
      this.handleNotOkResponse(fetchResult);
    }

    return fetchResult;
  }

  async put(targetUrl: string, object: any) {
    FetchClient.logRequestStart(targetUrl);

    const fetchResult: Response = await this.fetchClient.fetch(targetUrl, {
      method: 'put',
      body: json(object)
    });

    if (!fetchResult.ok) {
      this.handleNotOkResponse(fetchResult);
    }

    try {
      const result = fetchResult.json();
      FetchClient.logSuccess(targetUrl, fetchResult.status);
      return result;
    } catch (error) {
      logger.error('Unable to read fetch result', error);
      throw error;
    }
  }


  handleNotOkResponse(response: Response) {

  }


  static logRequestStart(url: string) {
    logger.info(`Started request to: [${url}]`);
  }


  static logSuccess(url: string, status: number) {
    logger.info(`Received valid response for url: [${url}] status: [${status}]`)
  }

}
