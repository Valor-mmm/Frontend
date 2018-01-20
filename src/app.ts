import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ILoginMessage, AuthRole, LoginMessage} from "./services/authMessages";

@inject(Aurelia, EventAggregator)
export class App {

  router;

  constructor(au, ea) {
    ea.subscribe(LoginMessage, (msg: ILoginMessage) => {
      if (msg.success === true) {
        if (msg.role === AuthRole.USER) {
          au.setRoot('user').then(() => {
              this.router.navigateToRoute('twTimeline');
            }
          );
        }
        if (msg.role === AuthRole.ADMIN) {
          au.setRoot('admin').then(() => {
            this.router.navigateToRoute('statistics');
          });
        }
      } else {
        au.setRoot('app').then(() => {
            this.router.navigateToRoute('twittr');
          }
        );
      }
    });
  }


  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'home'],
        name: 'twittr',
        moduleId: 'viewmodels/start/notLoggedIn/notLoggedIn',
        nav: true,
        title: 'Twittr'
      },
      {route: 'signup', name: 'signup', moduleId: 'viewmodels/start/signup/signup', nav: true, title: 'Signup'},
      {
        route: 'adminLogin',
        name: 'adminLogin',
        moduleId: 'viewmodels/start/loginAdmin/loginAdmin',
        nav: true,
        title: 'Admin'
      }
    ]);
    this.router = router;

    config.mapUnknownRoutes({ redirect: '#/' });
  }
}
