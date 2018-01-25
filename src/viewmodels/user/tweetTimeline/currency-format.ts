import {inject} from 'aurelia-framework';
import {ImageService} from "../../../services/svc/imageService";

@inject(ImageService)
export class CurrencyFormatValueConverter {

  constructor(private imageService: ImageService) {

  }

  toView(value) {
    if (!value) {
      return '';
    }

    return this.imageService.getUrlForImageId(value.image);
  }
}
