import * as chalk from 'chalk';

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
