export default {
  "presets": [
    require.resolve("babel-preset-react"),
    require.resolve("babel-preset-es2015"),
    require.resolve("babel-preset-stage-0")
  ],
  "devPlugins": [
    [require.resolve("babel-plugin-antd")],
    [require.resolve("babel-plugin-react-transform"), {
      "transforms": [{
        "transform": require.resolve("react-transform-hmr"),
        "imports": [require.resolve("react")],
        "locals": ["module"]
      }, {
        "transform": require.resolve("react-transform-catch-errors"),
        "imports": [require.resolve("react"), require.resolve("redbox-react")]
      }]
    }]
  ],
  plugins: [
    [require.resolve("babel-plugin-antd")]
  ]
}