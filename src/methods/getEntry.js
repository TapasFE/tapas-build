export default ({ production, entry, vendor}) => {
  // hmr enable via env
  !production && vendor.unshift('webpack-hot-middleware/client');

  if (vendor.length) {
    return {
      main: entry,
      vendor: vendor
    }
  } else {
    return [entry]
  }
}
