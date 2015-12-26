export default ({ production, entry, vendor}) => {
  // hmr enable via env
  !production && vendor.unshift('webpack-hot-middleware/client');

  return {
    main: entry,
    vendor: vendor
  }
}
