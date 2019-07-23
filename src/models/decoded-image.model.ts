import * as path from 'path';

import { Pixel } from '.';

/**
 * Common in-memory representation of an image as used in the converters.
 */
export class DecodedImage {
  private _name: string | null = null;
  private _width: number | null = null;
  private _height: number | null = null;

  /**
   * Array of pixels in the image.
   * NOTE: The order of the pixels may vary and
   * do not match the order of the array.
   */
  public pixels: Pixel[] = [];

  /**
   * The name of the image file.
   */
  public get name(): string {
    if (!this._name) {
      throw new Error('[ImageDescriptor][getter fileName] Filename has not been set.');
    }

    return this._name;
  }

  public set name(filePath: string) {
    if (path.extname(filePath) == '') {
      this._name = path.basename(filePath);
    } else {
      this._name = path.basename(filePath).substring(0, path.basename(filePath).lastIndexOf('.'));
    }
  }

  /**
   * Width of the image.
   * It must be a non negative number.
   */
  public get width(): number {
    if (!this._width) {
      throw new Error('[ImageDescriptor][getter width] Width has not been set.');
    }

    return this._width;
  }

  public set width(width: number) {
    DecodedImage.checkDimensionValue(width);

    this._width = width;
  }

  /**
   * Height of the image.
   * It must be a non negative number.
   */
  public get height(): number {
    if (!this._height) {
      throw new Error('[ImageDescriptor][getter height] Height has not been set.');
    }

    return this._height;
  }

  public set height(height: number) {
    DecodedImage.checkDimensionValue(height);

    this._height = height;
  }

  private static checkDimensionValue(widthOrHeight: number): void {
    if (widthOrHeight < 0 || !Number.isInteger(widthOrHeight)) {
      throw new RangeError('[ImageDescriptor][checkDimensionValue] Image dimensions must be positive integer numbers.');
    }
  }
}
