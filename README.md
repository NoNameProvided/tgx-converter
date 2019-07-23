# tgx-converter

A simple TGX to PNG, JPG, BMP converter.

> **What is the TGX file format?**
>
> The `.tgx` file format is used in the [Stronghold][schd-official-page] series to store non-animated image files.

### Installation

```
npm install -g tgx-converter
```

### Usage

#### Via CLI

```
$ tgxc --help

  USAGE

      $ tgxc [--help] --source /some/path/to/folder --output /path/to/destination/folder

  OPTIONS
      --help            Shows this help message
      --source          Source folder which contains the TGX files
      --output          Output directory for generated JPEG/PNG/BMP files
      --format          PNG | JPG | BMP
      --log-level       VERBOSE | INFO | WARNING | ERROR
```

#### Via API

_TBD..._

## License

[MIT](./LICENSE)

[schd-official-page]: https://fireflyworlds.com/games/strongholdcrusader/
