import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {UserData} from "./services/svc/user/userData";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-validation');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.container.registerSingleton(UserData);

  aurelia.start().then(() => aurelia.setRoot());
}
