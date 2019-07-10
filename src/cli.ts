import * as arg from 'arg';
import * as chalk from 'chalk';

import { HELP_MESSAGE } from './cli/help-mesage.constant';
import { Logger } from './helpers/logger.util';
import { LogLevel } from './enums/log-level.enum';
import { TargetImageFormats } from './enums/target-image-formats.enum';
import { TgxConverter } from './lib';

const args = arg({
  '--help': Boolean,
  '--source': String,
  '--output': String,
  '--format': String,
  '--log-level': String,
});

if (args['--help']) {
  console.error(HELP_MESSAGE);
  process.exit(2);
}

if (!args['--source'] || !args['--output']) {
  Logger.error(chalk.default`The {bold --source} and {bold --output} parameters are required!`);
  process.exit(2);
}

if (args['--log-level']) {
  /* eslint-disable-next-line */
  const logLevel: keyof typeof LogLevel = args['--log-level'] as any;

  if (!LogLevel[logLevel]) {
    Logger.error(chalk.default`The ${logLevel} value is not valid for the {bold --log-level} parameter!`);
    process.exit(2);
  }

  Logger.logLevel = LogLevel[logLevel];
}

if (args['--format']) {
  /* eslint-disable-next-line */
  const targetFileFormat: keyof typeof TargetImageFormats = args['--format'] as any;

  if (!TargetImageFormats[targetFileFormat]) {
    Logger.error(chalk.default`The ${targetFileFormat} value is not valid for the {bold --format} parameter!`);
    process.exit(2);
  }
}

TgxConverter.convertTgxToImage(
  args['--source'] as string,
  args['--output'] as string,
  /* eslint-disable-next-line */
  TargetImageFormats[args['--format'] as any] as TargetImageFormats
).catch(error => {
  Logger.error('Error during the file transformation!');
  Logger.error(error);
});
