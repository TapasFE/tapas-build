export default {
  "presets": [
    "babel-preset-react",
    "babel-preset-es2015",
    "babel-preset-stage-0"
  ],
  "devPlugins": [
    ["babel-plugin-antd"],
    ["babel-plugin-react-transform", {
      "transforms": [{
        "transform": "react-transform-hmr",
        "imports": ["react"],
        "locals": ["module"]
      }, {
        "transform": "react-transform-catch-errors",
        "imports": ["react", "redbox-react"]
      }]
    }]
  ],
  plugins: [
    ["babel-plugin-antd"]
  ]
}
