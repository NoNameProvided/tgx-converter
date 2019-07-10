import { Pixel } from '../models/pixel.model';
import { Color } from '../models/color.model';
import { Logger } from '../helpers/logger.util';
import { TgxToken } from '../interfaces/tgx-token.interface';
import { TgxTokenType } from '../enums/tgx-token-type.enum';
import { ImageDescriptor } from '../image-descriptor.class';

export class TgxImageConverter {
  /**
   * Decodes the image data of a tgx file.
   * @param buffer buffer containing the tgx image
   */
  public static async decodeImage(buffer: Buffer, fileName: string): Promise<ImageDescriptor> {
    Logger.debug(`[TgxImageConverter][decodeImage] Starting to decode ${fileName}.`);

    const imageDescriptor: ImageDescriptor = new ImageDescriptor();
    const { width, height } = TgxImageConverter.extractImageDimension(buffer);

    imageDescriptor.name = fileName;
    imageDescriptor.width = width;
    imageDescriptor.height = height;

    let offset = 8; // first 8 byte of the file is the header
    let line = 0;
    let cursor = 0;

    while (offset < buffer.length) {
      const token = TgxImageConverter.extractToken(buffer, offset);

      Logger.debug(
        `[TgxImageConverter][decodeImage] Decoded token as ${token.tokenType} at ${offset} with length ${token.length}.`
      );

      switch (token.tokenType) {
        case TgxTokenType.NEW_LINE:
          line++;
          cursor = cursor - imageDescriptor.width;
          offset = offset + 1;

          break;
        case TgxTokenType.REPEATER:
          const color = TgxImageConverter.getColor(buffer, offset + 1, 1);

          for (let i = 0; i < token.length; i++) {
            imageDescriptor.pixels.push(new Pixel({ x: cursor, y: line }, color[0]));
            cursor++;
          }

          // header + 1 color
          offset = offset + 3;

          break;
        case TgxTokenType.STREAM:
          const colors = TgxImageConverter.getColor(buffer, offset + 1, token.length);

          imageDescriptor.pixels = [
            ...imageDescriptor.pixels,
            ...colors.map(color => {
              const pixel = new Pixel({ x: cursor, y: line }, color);
              cursor++;
              return pixel;
            }),
          ];

          offset = offset + 1 + token.length * 2;

          break;
        case TgxTokenType.TRANSPARENT:
          cursor = cursor + token.length;
          offset = offset + 1;

          break;
        default:
          throw new Error(`[TgxImageConverter][decodeImage] Encountered an unknown TGX token type: ${token.tokenType}`);
      }
    }

    return imageDescriptor;
  }

  /**
   * Image dimension is in the first 8 byte
   * width is the first 2 byte followed by two zero byte padding
   * height is the next 2 byte followed by two zero byte padding again
   *
   * @param buffer buffer containing the tgx image
   */
  private static extractImageDimension(buffer: Buffer): { width: number; height: number } {
    const width = buffer.readUIntLE(0, 2);
    const height = buffer.readUIntLE(4, 2);

    Logger.debug(`[TgxImageConverter][extractImageDimension] Image dimensions: ${width}x${height}`);

    return { width, height };
  }

  /**
   * Decodes a token at the given offset.
   *
   * @param buffer buffer containing the tgx image
   * @param offset offset to the first byte of the token
   */
  private static extractToken(buffer: Buffer, offset: number = 0): TgxToken {
    Logger.debug(`[TgxImageConverter][extractToken] Getting token at ${offset}.`);

    /**
     * The type is stored in the first three bit of the first byte,
     * and the length of the token is stored in the next 5 bit.
     */
    const tokenHeaderString = this.fillLeadingZeros(buffer.readUInt8(offset).toString(2), 1);
    const length = this.getLength(tokenHeaderString);

    Logger.debug(`[TgxImageConverter][extractToken] Token header is ${tokenHeaderString}.`);

    switch (tokenHeaderString.substr(0, 3)) {
      case TgxTokenType.STREAM:
        return { tokenType: TgxTokenType.STREAM, length };
      case TgxTokenType.NEW_LINE:
        return { tokenType: TgxTokenType.NEW_LINE, length };
      case TgxTokenType.REPEATER:
        return { tokenType: TgxTokenType.REPEATER, length };
      case TgxTokenType.TRANSPARENT:
        return { tokenType: TgxTokenType.TRANSPARENT, length };
      default:
        throw new TypeError(
          `[TgxImageConverter][extractToken] Invalid TGX token header type: ${tokenHeaderString.substr(0, 3)}`
        );
    }
  }

  /**
   * Color is always stored in 2 byte
   * @param buffer
   * @param start
   */
  private static getColor(buffer: Buffer, start: number, length: number = 1): Color[] {
    const result = [];

    for (let i = 0; i < length; i++) {
      const colorBuffer = buffer.slice(start + i * 2, start + i * 2 + 2);
      let binaryString = colorBuffer.readUInt16BE(0).toString(2);
      binaryString = '0000000000000000'.substr(binaryString.length) + binaryString;

      // https://runkit.com/nonameprovided/585803fee94bf2001403dda8
      // 21th repeater is r: 99 g: 239 b: 123 => 63ef7b instead of r: 216 g: 200 b: 136 => #d8c888
      // H: <Buffer 31 ef> => 0011 0001 1110 1111 -> correct
      // C: <Buffer 31 ef> => 1110 1111 0011 0001
      // Scheme:              gggb bbbb xrrr rrgg

      //                              GREEN: 11001 (25 * 8 = 200) ==> gg + ggg is correct, not ggg + gg
      // H: RED: 11011 (27 * 8 = 216) GREEN: 00111 (7 * 8 = 56) BLUE: 10001 (17 * 8 = 136)
      // C: RED: 01100 (12 * 8.22580 = 99) GREEN: 11101 (29 * 8.22580 = 239) BLUE: 01111 (15 * 8.22580 = 123)

      // color scheme is gggbbbbbxrrrrrgg
      const redString = binaryString.substr(9, 5);
      const greenString = binaryString.substr(14, 2) + binaryString.substr(0, 3);
      const blueString = binaryString.substr(3, 5);

      const multiplier = 8.2258;

      // 11111 = 31 ==> 255 / 31 = 8.22580
      const red = Math.round(Number.parseInt(redString, 2) * multiplier);
      const green = Math.round(Number.parseInt(greenString, 2) * multiplier);
      const blue = Math.round(Number.parseInt(blueString, 2) * multiplier);

      const color = new Color({ red, green, blue, alpha: 255 });
      // Logger.log('color', binaryString, color, { redString, greenString, blueString }, { red, green, blue });
      Logger.verbose(
        `[TgxImageConverter][getColor] Generated color from ${binaryString} to r: ${color.red} g: ${color.green} b: ${color.blue}`
      );

      result.push(color);
    }

    return result;
  }

  /**
   * Fills the striped leading zeros after converting
   * binary data to binary string representation.
   *
   * @param binaryString the string representation
   * @param byteCount original amount of bytes converted
   */
  private static fillLeadingZeros(binaryString: string, byteCount: number = 1): string {
    const zeros = Array.from(Array(byteCount * 8))
      .fill('0')
      .join('');

    return zeros.substr(binaryString.length) + binaryString;
  }

  /**
   * Gets the length of content bytes belonging to a token.
   *
   * @param tokenHeaderString 1 byte token header string as a binary string
   */
  private static getLength(tokenHeaderString: string): number {
    const tokenLengthBinaryString = tokenHeaderString.substr(3);

    /**
     * Zero length is not available so 00000 means 1 and 11111 means 32.
     */
    return Number.parseInt(tokenLengthBinaryString, 2) + 1;
  }
}
