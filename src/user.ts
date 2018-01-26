import {inject, Aurelia} from 'aurelia-framework';

@inject(Aurelia)
export class User {

  aurelia;
  router;

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'home'],
        name: 'twTimeline',
        moduleId: 'viewmodels/user/tweetTimeline/tweetTimeline',
        nav: true,
        title: 'Timeline'
      },
      {
        route: 'settings',
        name: 'settings',
        moduleId: 'viewmodels/user/userSettings/userSettings',
        nav: true,
        title: 'Settings'
      },
      {route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout'}
    ]);
    this.router = router;

    config.mapUnknownRoutes({redirect: '#/'});
  }
}
