import * as diagram from './diagram';
import changeDepTree from './changeDepTree';

import { createPackageInfoTree, packageMemoizeInfo } from "./packageInfo";

const packageName = 'webpack';

const getSimpleInfo = (name) => {
  return fetch('https://api.npms.io/v2/package/' + name)
    .then(response => response.json())
};

getSimpleInfo(packageName).then(data => {
  console.log('package info from api', data);
});

createPackageInfoTree(packageName)
  .then(depTree => {
    console.log('tree', depTree);
    console.log('packageMemoizeInfo', packageMemoizeInfo);
    const dataTree = changeDepTree(depTree, 'npm', 'downloads');
    diagram.render(dataTree);
  });





