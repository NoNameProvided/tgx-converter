import { FileHelper } from './helpers/file-reader.util';
import { TgxImageConverter } from './converters/tgx-image-converter.class';
import { ImageConverter } from './converters/image-conveter.class';
import { TargetImageFormats } from './enums/target-image-formats.enum';
import { Logger } from './helpers/logger.util';
import * as path from 'path';
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

    for (let tgxFileName of tgxFilePaths) {
      Logger.log(`[TgxConverter][convertTgxToImage] Converting ${tgxFileName} to ${format}...`);
      const tgxFileBuffer = await FileHelper.read(path.join(sourcePath, tgxFileName));
      const imageDescriptor = await TgxImageConverter.decodeImage(tgxFileBuffer, path.basename(tgxFileName));
      const encodedPngImageBuffer = await ImageConverter.encodeImage(imageDescriptor, format);

      await FileHelper.write(
        `${outputPath}\\${imageDescriptor.name}.${FILE_EXTENSIONS[format]}`,
        encodedPngImageBuffer
      );
    }
  }
}
