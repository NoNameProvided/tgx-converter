import { promisify } from 'util';
import * as Jimp from 'jimp';

import { Pixel } from '../models/pixel.model';
import { Logger } from '../helpers/logger.util';
import { Color } from '../models/color.model';
import { TargetImageFormats } from '../enums/target-image-formats.enum';
import { ImageDescriptor } from '../image-descriptor.class';

export class ImageConverter {
  /**
   * Decodes the image data of a supported image file.
   * @param buffer buffer containing the png image
   */
  public static async decodeImage(buffer: Buffer, fileName: string): Promise<ImageDescriptor> {
    Logger.debug(`[ImageConverter][decodeImage] Starting to decode ${fileName}.`);

    const imageDescriptor: ImageDescriptor = new ImageDescriptor();

    imageDescriptor.name = fileName;

    const image = await Jimp.read(buffer);

    imageDescriptor.width = image.bitmap.width;
    imageDescriptor.height = image.bitmap.height;

    image.scan(0, 0, imageDescriptor.width, imageDescriptor.height, (x, y, idx) => {
      const color = new Color({
        red: image.bitmap.data[idx + 0],
        green: image.bitmap.data[idx + 1],
        blue: image.bitmap.data[idx + 2],
        alpha: image.bitmap.data[idx + 3],
      });

      imageDescriptor.pixels.push(new Pixel({ x, y }, color));
    });

    return imageDescriptor;
  }

  /**
   * Encodes the image data to the the specified file.
   */
  public static async encodeImage(imageDescriptor: ImageDescriptor, format: TargetImageFormats): Promise<Buffer> {
    Logger.debug(`[TargetImageConverter][encodeImage] Starting to encode image data to ${format} format.`);
    const image: Jimp = new Jimp(imageDescriptor.width, imageDescriptor.height, 0x00000000);

    imageDescriptor.pixels.forEach(pixel => {
      image.setPixelColor(
        Jimp.rgbaToInt(pixel.color.red, pixel.color.green, pixel.color.blue, 255, () => {}),
        pixel.position.x,
        pixel.position.y
      );
    });

    return await promisify(image.getBuffer).bind(image)(format);
  }
}
