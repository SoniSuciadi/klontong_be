import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class ImagekitService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await this.imagekit.upload({
        file: file.buffer.toString('base64'),
        fileName: file.originalname,
      });
      return result.url;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Image upload failed: ${error.message}`);
      } else {
        throw new Error('Image upload failed with an unknown error');
      }
    }
  }
}
