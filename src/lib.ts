import * as path from 'path';

import { FileHelper, Logger } from './helpers';
import { ImageConverter, TgxImageConverter } from './converters';
import { TargetImageFormats } from './enums';
import { FILE_EXTENSIONS } from './constants/file-extensions.constant';

export class TgxConverter {
  /**
   * Converts the TGX files found in the soruce path and writes them to the target folder.
   *
   * @param sourcePath input folder containing TGX files
   * @param outputPath existing output folder where files are written
   * @param format the target file type
   */
  public static async convertTgxToImage(
    sourcePath: string,
    outputPath: string,
    format: TargetImageFormats = TargetImageFormats.PNG
  ): Promise<void> {
    const tgxFilePaths = await FileHelper.list(sourcePath, '.tgx');

    Logger.log(`Processing ${tgxFilePaths.length} file at ${sourcePath}`);

    for (const tgxFileName of tgxFilePaths) {
      Logger.log(`[TgxConverter][convertTgxToImage] Converting ${tgxFileName} to ${format}...`);
      const tgxFileBuffer = await FileHelper.read(path.join(sourcePath, tgxFileName));
      const imageDescriptor = await TgxImageConverter.decodeImage(tgxFileBuffer, path.basename(tgxFileName));
      const encodedPngImageBuffer = await ImageConverter.encodeImage(imageDescriptor, format);

      await FileHelper.write(
        `${outputPath}${path.sep}${imageDescriptor.name}.${FILE_EXTENSIONS[format]}`,
        encodedPngImageBuffer
      );
    }
  }
}
