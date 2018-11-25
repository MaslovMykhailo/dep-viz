import * as diagram from './diagram';
import fetchPackageInfo from './fetchPackageInfo';
import changeDepTree from './changeDepTree';

const getSimpleInfo = (name) => {
  return fetch('https://api.npms.io/v2/package/' + name)
    .then(response => response.json())
};

getSimpleInfo('react').then(data => {
  console.log(data);
});

fetchPackageInfo('react').then(depTree => {
  console.log(depTree);
  const tree = changeDepTree(depTree, 'npm', 'downloads');
  console.log(tree);
  diagram.render(tree);
});





