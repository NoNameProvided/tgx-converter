import { Pixel } from '../models/pixel.model';

/**
 * Common image definition used in the converters.
 */
export interface Image {
  /**
   * The name of the image file.
   */
  name: string;

  /**
   * Width of the image.
   * It must be a non negative number.
   */
  width: number;

  /**
   * Height of the image.
   * It must be a non negative number.
   */
  height: number;

  /**
   * Array of pixels in the image.
   * NOTE: The order of the pixels may vary and
   * do not match the order of the array.
   */
  pixels: Pixel[];
}
