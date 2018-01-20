import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class AppRouter {

  aurelia;
  router;

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'home'], name: 'Twittr', moduleId: 'viewmodels/donate/donate', nav: true, title: 'Donate' },
      { route: 'report', name: 'report', moduleId: 'viewmodels/report/report', nav: true, title: 'Report' },
      { route: 'candidates', name: 'candidates', moduleId: 'viewmodels/candidate/candidate', nav: true, title: 'Candidates' },
      { route: 'stats', name: 'stats', moduleId: 'viewmodels/stats/stats', nav: true, title: 'Stats' },
      { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
    ]);
    this.router = router;

    config.mapUnknownRoutes(instruction => {
      return 'home';
    });
  }
}
