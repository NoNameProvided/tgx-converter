/**
 * Available token types in TGX files.
 * This stored in the tokens in TGX files alongside with length.
 */
export enum TgxTokenType {
  /**
   * Stream of pixels stored in 2 bytes per pixel
   * after the token for the specified length.
   */
  STREAM = '000',

  /**
   * New line, length is always 1, but there are no bytes after this token.
   */
  NEW_LINE = '100',

  /**
   * Repeat the pixel stored in the next 2 bytes
   * after this token for the specified length.
   */
  REPEATER = '010',

  /**
   * Move the cursor to the right by the length.
   */
  TRANSPARENT = '001',
}
