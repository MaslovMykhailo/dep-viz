import diagram from '../diagram/diagram';
import { rebuild } from '../diagram/actions';

export default (mainActionFlow, anotherActionFlow) => (event) => {
  const file = event.target.files[0];
  if (file.type !== 'application/json') {
    anotherActionFlow();
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);
    if (data.dependencies) {
      if (diagram.dataTree) rebuild();

      mainActionFlow({
        name: data.name,
        dependencies: Object.keys(data.dependencies),
        description: data.description
      });
    } else {
      anotherActionFlow();
    }
  };

  reader.readAsText(file);
}