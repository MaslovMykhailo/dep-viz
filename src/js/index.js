import * as diagram from './diagram';
import fetchPackageInfo, { packageMemoizeInfo } from './fetchPackageInfo';
import changeDepTree from './changeDepTree';


const packageName = 'webpack';

const getSimpleInfo = (name) => {
  return fetch('https://api.npms.io/v2/package/' + name)
    .then(response => response.json())
};

getSimpleInfo(packageName).then(data => {
  console.log('package info from api', data);
});

fetchPackageInfo(packageName).then(depTree => {
  console.log('package info with dep', depTree);
  console.log('memoize package info', packageMemoizeInfo);
  const tree = changeDepTree(depTree, 'npm', 'downloads');
  console.log('tree of package dep', tree);
  diagram.render(tree);
});





