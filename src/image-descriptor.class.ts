import * as path from 'path';

import { Pixel } from './models/pixel.model';
import { Image } from './interfaces/image.interface';

export class ImageDescriptor implements Image {
  private _name: string | null = null;
  private _width: number | null = null;
  private _height: number | null = null;

  public pixels: Pixel[] = [];

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

  public get width(): number {
    if (!this._width) {
      throw new Error('[ImageDescriptor][getter width] Width has not been set.');
    }

    return this._width;
  }

  public set width(width: number) {
    ImageDescriptor.checkDimensionValue(width);

    this._width = width;
  }

  public get height(): number {
    if (!this._height) {
      throw new Error('[ImageDescriptor][getter height] Height has not been set.');
    }

    return this._height;
  }

  public set height(height: number) {
    ImageDescriptor.checkDimensionValue(height);

    this._height = height;
  }

  private static checkDimensionValue(widthOrHeight: number): void {
    if (widthOrHeight < 0 || !Number.isInteger(widthOrHeight)) {
      throw new RangeError('[ImageDescriptor][checkDimensionValue] Image dimensions must be positive integer numbers.');
    }
  }
}
