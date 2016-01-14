export default ({ production, entry, vendor, autoExternals, isComponent}) => {
  // hmr enable via env
  !production && vendor.unshift('webpack-hot-middleware/client');

  // async/await 的runtime
  !isComponent && vendor.unshift('babel-polyfill');

  if (vendor.length) {
    return {
      main: entry,
      vendor: vendor
    }
  } else {
    return {
      index: entry
    }
  }
}
