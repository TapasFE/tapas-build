import fs from 'fs';
import {join} from 'path';
import cdnInfo from 'npm-cdn-amd-loader/cdnInfo';

export default ((context, request, callback) => {
  let cdn = cdnInfo[request];
  if(cdn) {
    return callback(null, request, 'umd');
  }
  callback();
}).bind(this);
