import handleFileSelect from './file/handleFileSelect';
import * as data from './data/actions';
import * as diagram from './diagram/actions';
import * as logo from './logo/actions';

const mainActionFlow = (projectData) => {
  logo.exitFromFrame()
    .then(() => diagram.enterToFrame())
    .then(() => data.buildTreeFromPackageData(projectData))
    .then(tree => diagram.build(tree));
};

const anotherActionFlow = () => { /* do nothing */ };

data.fetchPackageInfo('redux').then(d => console.log(d)).catch(console.error);

document
  .getElementById('file')
  .addEventListener('change', handleFileSelect(mainActionFlow, anotherActionFlow));

