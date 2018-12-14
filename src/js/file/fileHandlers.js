import * as diagram from '../diagram/actions';
import changeDepTree from '../diagram/changeDepTree';
import { createPackageInfoTree } from "../data/actions";

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file.type !== 'application/json') return;

  const reader = new FileReader();

  reader.onload = function(e) {
      const data = JSON.parse(e.target.result);
      if (data.dependencies) {
        diagram.clear();

        const treeRoot = {
          name: data.name,
          dependencies: Object.keys(data.dependencies)
        };

        Promise.all(treeRoot.dependencies.map(dep => createPackageInfoTree(dep)))
          .then(depList => Object.assign({}, treeRoot, { dependencies: depList }))
          .then(tree => {
            const dataTree = changeDepTree(tree, 'npm', 'downloads');
            diagram.render(dataTree);
          })
      }
  };

  reader.readAsText(file);
}

document.getElementById('file').addEventListener('change', handleFileSelect);