import { TgxTokenType } from '../enums/tgx-token-type.enum';

/**
 * The default building block of a TGX image.
 *
 * Every token contains a fixed length header and a varying length content.
 */
export interface TgxToken {
  /**
   * Type of the token.
   */
  tokenType: TgxTokenType;

  /**
   * Length of pixels belonging to this token,
   * each pixel is stored in 2 bytes so the total number of bytes is length * 2.
   */
  length: number;
}
