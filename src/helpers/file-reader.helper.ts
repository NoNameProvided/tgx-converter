import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { Logger } from './logger.helper';

export class FileHelper {
  private static readFile = promisify(fs.readFile);
  private static writeFile = promisify(fs.writeFile);
  private static listDirectory = promisify(fs.readdir);

  public static async list(filePath: string, extensionFilter: string): Promise<string[]> {
    const absolutePath = path.resolve(filePath);

    Logger.debug(`[FileHelper][list] Listing files at "${absolutePath}".`);

    const filePaths = await FileHelper.listDirectory(absolutePath);
    const filteredFilePaths = filePaths.filter(filePath => path.extname(filePath) == extensionFilter);

    Logger.debug(`[FileHelper][list] Found ${filteredFilePaths.length} file with "${extensionFilter}" extension.`);

    return filteredFilePaths;
  }

  public static async read(filePath: string): Promise<Buffer> {
    const absolutePath = path.resolve(filePath);

    Logger.debug(`[FileHelper][readFile] Reading file from ${absolutePath}.`);

    return await FileHelper.readFile(absolutePath);
  }

  public static async write(filePath: string, buffer: Buffer): Promise<void> {
    const absolutePath = path.resolve(filePath);

    Logger.debug(`[FileHelper][readFile] Writing file to ${absolutePath}.`);

    return await FileHelper.writeFile(absolutePath, buffer, { encoding: 'binary' });
  }
}
