import {inject, Aurelia} from 'aurelia-framework';

@inject(Aurelia)
export class Admin {

  aurelia;
  router;

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'home'],
        name: 'statistics',
        moduleId: 'viewmodels/admin/statistics/statistics',
        nav: true,
        title: 'Statistics'
      },
      {route: 'users', name: 'users', moduleId: 'viewmodels/admin/manageUsers/manageUsers', nav: true, title: 'Users'},
      {
        route: 'tweets',
        name: 'tweets',
        moduleId: 'viewmodels/admin/manageTweets/manageTweets',
        nav: true,
        title: 'Tweets'
      },
      {route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout'}
    ]);
    this.router = router;

    config.mapUnknownRoutes({ redirect: '#/' });

  }
}
