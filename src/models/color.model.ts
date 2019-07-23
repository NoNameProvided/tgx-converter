import { RgbaColor } from '../interfaces';

/**
 * Universal RGBA color definition.
 * The default value is 0x00000000, aka transparent black.
 */
export class Color {
  private r: number = 0;
  private g: number = 0;
  private b: number = 0;
  private a: number = 0;

  constructor(rgbaColor?: RgbaColor) {
    if (rgbaColor) {
      this.setColor(rgbaColor);
    }
  }

  public get red(): number {
    return this.r;
  }

  public set red(channelValue: number) {
    Color.checkChannelValue(channelValue);
    this.r = channelValue;
  }

  public get green(): number {
    return this.g;
  }

  public set green(channelValue: number) {
    Color.checkChannelValue(channelValue);
    this.g = channelValue;
  }

  public get blue(): number {
    return this.b;
  }

  public set blue(channelValue: number) {
    Color.checkChannelValue(channelValue);
    this.b = channelValue;
  }

  public set alpha(channelValue: number) {
    Color.checkChannelValue(channelValue);
    this.a = channelValue;
  }

  public get alpha(): number {
    return this.a;
  }

  public setColor(rgbaColor: RgbaColor): void {
    this.red = rgbaColor.red;
    this.green = rgbaColor.green;
    this.blue = rgbaColor.blue;
    this.alpha = rgbaColor.alpha;
  }

  /**
   * Checks if the passed parameter is a valid RGBA channel value.
   * @param value an RGBA channel value
   */
  private static checkChannelValue(value: number): void {
    if (value < 0 || value > 255) {
      throw new RangeError(
        `[Color][checkChannelValue] An RGBA channel value must be between 0-255, got ${value} instead.`
      );
    }
  }
}
