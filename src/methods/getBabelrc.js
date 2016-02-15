import resolve from 'resolve';

let reactPath;

try {
  reactPath = resolve.sync('react', { basedir: process.cwd() });
} catch (e) {
  reactPath = require.resolve('react');
}

export default {
  "presets": [
    "react",
    "es2015",
    "stage-0"
  ],
  "devPlugins": [
    ["antd"],
    ["react-transform", {
      "transforms": [{
        "transform": "react-transform-hmr",
        "imports": [reactPath],
        "locals": ["module"]
      }, {
        "transform": "react-transform-catch-errors",
        "imports": [reactPath, "redbox-noreact"]
      }]
    }]
  ],
  plugins: [
    ["antd"]
  ]
};
