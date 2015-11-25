# Tapas-build

## A command line tools for building React project.

------

### Install

``` shell
$ npm install tapas-build -g
```

### Usage

``` shell
$ tapas-build <entry> <output>
```

### Options

``` 
-h, --help
-p, --production
-w, --watch
--config <example.config.js>
```

### Config

#### Cover mode

To export `Plain Object`

#### Extend mode

To export `Function`

``` javascript
/**
 * @param  defaultConfig {Object} 
 * @param  environment   {String} <production | development>
 * @return customConfig  {Object}
 */
export default function(defaultConfig, environment) {
  let customConfig = Object.assign({}, ...defaultConfig);
  customConfig.output.path = join(__dirname, './static');
  return customConfig;
}
```

### License

Copyright (c) 2015 Tapas Tech

MIT [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)