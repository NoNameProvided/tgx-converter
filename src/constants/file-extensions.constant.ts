import { TargetImageFormats } from '../enums/target-image-formats.enum';
import { SourceImageFormats } from '../enums/source-image-formats.enum';

export const FILE_EXTENSIONS: { [key: string]: string } = {
  [TargetImageFormats.JPG]: 'jpg',
  [TargetImageFormats.PNG]: 'png',
  [TargetImageFormats.BMP]: 'bmp',
  [SourceImageFormats.TGX]: 'tgx',
  [SourceImageFormats.GM1]: 'gm1',
};
