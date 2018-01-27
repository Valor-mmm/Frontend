import {inject, LogManager} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator';
import {AdminService} from "../../../services/svc/admin/adminService";
import {ValidationController, ValidationRules} from "aurelia-validation";

const logger = LogManager.getLogger('LoginAdmin');

@inject(EventAggregator, AdminService, ValidationController)
export class LoginAdmin {

  username: string;
  password: string;

  errorMessage: string;


  eventAggregator: EventAggregator;

  constructor(ea: EventAggregator, private adminService: AdminService, private controller: ValidationController) {
    this.eventAggregator = ea;

    ValidationRules
      .ensure((w: LoginAdmin) => w.username).required()
      .ensure((w: LoginAdmin) => w.password).required()
      .on(this);
  }

  async validate() {
    try {
      const result = await this.controller.validate({object: this});
      return result.valid;
    } catch (err){
      logger.warn('Validation failed with error.', err);
      return false;
    }
  }

  async login() {
    const valid = await this.validate();
    if (!valid) {
      return;
    }

    try {
      await this.adminService.authenticate(this.username, this.password);
    } catch (err) {
      if (err.message) {
        this.errorMessage = err.message;
      }
      this.errorMessage = err;
    }
  }

}
