import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import FetchConfig from "./fetchConfig";

@inject(HttpClient, FetchConfig)
export class FetchClient {

  fetchClient: HttpClient;
  static authToken?: string;

  constructor(client: HttpClient, fetchConfig: FetchConfig) {
    this.fetchClient = client;
    this.fetchClient.configure(config => {
      config.withBaseUrl(fetchConfig.baseUrl).withInterceptor({
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

}
