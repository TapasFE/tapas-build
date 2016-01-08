import fs from 'fs';
import {join} from 'path';
import cdnInfo from 'tapas-externals/src/cdnInfo';

export default ((context, request, callback) => {
  let cdn = cdnInfo[request];
  if(cdn) {
    return callback(null, request, cdn.moduleType);
  }
  callback();
}).bind(this);
