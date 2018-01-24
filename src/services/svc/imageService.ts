import {inject, LogManager} from 'aurelia-framework';
import {FetchClient} from "../FetchClient";
import FetchConfig from "../fetchConfigLocal";

const logger = LogManager.getLogger('ImageService');

@inject(FetchClient, FetchConfig)
export class ImageService {

  constructor(private fetchClient: FetchClient, private fetchConfig: FetchConfig) {

  }

  async saveImage(image: File) {
    if (!image) {
      logger.warn('Image to save was null.');
      return null;
    }
    const formData: FormData = new FormData();
    formData.append('image', image);

    try {
      const uploadResult = await this.fetchClient.postForm(this.fetchConfig.imagePart, formData);
      if (uploadResult && uploadResult.public_id) {
        return uploadResult.public_id;
      } else {
        logger.error('Img Upload result hat not expected parameters', uploadResult);
        return null;
      }
    } catch (exception) {
      logger.error('Exception during upload of image.', exception);
      return null;
    }
  }

  async getUrlForImageId(imageId: string) {

    if (!imageId) {
      logger.warn('Required image public id is null');
      return null;
    }

    const queryObj = {
      publicId: imageId
    };

    try {
      return await this.fetchClient.getText(this.fetchConfig.imagePart, queryObj);
    } catch (err) {
      logger.error('Exception during fetch of image url.', err);
      return null;
    }
  }

}
