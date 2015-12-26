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
        "imports": ["react"],
        "locals": ["module"]
      }, {
        "transform": "react-transform-catch-errors",
        "imports": ["react", "redbox-react"]
      }]
    }]
  ],
  plugins: [
    ["antd"]
  ]
}
