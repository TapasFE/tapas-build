import './monkeyPatchHtmlWebpackPlugin';
import fs from 'fs';
import {join} from 'path';

let cdnInfo = JSON.parse(fs.readFileSync(join(__dirname, '../../cdnInfo.json'))).data;
export let externals = new Set();
export default ((context, request, callback) => {
  let cdn;
  cdnInfo.forEach(item => {
    if(request === item.name) {
      cdn = item
    }
  });
  if(cdn) {
    externals.add(cdn.minUrl);
    return callback(null, cdn.global, 'var');
  }
  callback();
}).bind(this);
