# Tapas-build

## A command line tools for building React project.

![NPM](https://img.shields.io/npm/v/tapas-build.svg)

### Install

``` shell
$ npm install tapas-build -g
```

### Usage

``` shell
$ tapas-build --index pathToYourIndex.html <entry> <output>
```

### Options

```
-h, --help
-p, --production
-i. --index
```

You can also add the config variables `tapas` to your projects package.json like this:

```
  "tapas": {
    "entry": "./client/app.js",
    "output": "./build",
    "index": "./template.html",
    "vendor": ["react", "react-dom"],
    "babelLoaderPlugins": ["./scripts/babelRelayPlugin"],
    "port": "12306",
    "cssModules": true,
    "aliasRoot" : "#",
    "resolveRoot": "/absolute/path/to/your/src/directory",
    "autoExternals": true
  }
```

### develop
shell
```
  NODE_ENV=dev tapas-build
```

### License

Copyright (c) 2015 Tapas Tech

MIT [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
