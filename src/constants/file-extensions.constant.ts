import { TargetImageFormats, SourceImageFormats } from '../enums';

export const FILE_EXTENSIONS: { [key: string]: string } = {
  [TargetImageFormats.JPG]: 'jpg',
  [TargetImageFormats.PNG]: 'png',
  [TargetImageFormats.BMP]: 'bmp',
  [SourceImageFormats.TGX]: 'tgx',
  [SourceImageFormats.GM1]: 'gm1',
};
