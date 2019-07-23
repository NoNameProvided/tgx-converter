import * as arg from 'arg';
import * as chalk from 'chalk';

import { Logger } from './helpers';
import { LogLevel, TargetImageFormats } from './enums';
import { TgxConverter } from './lib';

export const HELP_MESSAGE = chalk.default`
  {bold USAGE}

      {dim $} {bold tgxc} [--help] --source {underline /some/path/to/folder} --output {underline /path/to/destination/folder}

  {bold OPTIONS}
      --help            Shows this help message
      --source          Source folder which contains the TGX files
      --output          Output directory for generated JPEG/PNG/BMP files 
      --format          {underline PNG} | {underline JPG} | {underline BMP}          
      --log-level       {underline VERBOSE} | {underline INFO} | {underline WARNING} | {underline ERROR}                
`;

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
