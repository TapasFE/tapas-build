export default ({ production, entry, vendor, autoExternals, isComponent}) => {
  // hmr enable via env
  !production && vendor.unshift('webpack-hot-middleware/client');

  // 如果autoExternals 为 true， 用tapas-externals 作为amd loader
  autoExternals && vendor.unshift('tapas-externals');

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
