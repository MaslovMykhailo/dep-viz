import stat from './statistic';
import data from '../data/data';

export const enterToFrame = () => {
  return new Promise(resolve => {
    stat.statNode.style.opacity = '1';
    stat.statNode.style.height = 'auto';
    stat.statNode.style.width = '350px';

    setTimeout(() => { resolve() }, 760);
  });
};

export const exitFromFrame = () => {
  return new Promise(resolve => {
    stat.statNode.style.opacity = '0';
    setTimeout(() => { resolve() }, 1000);
  });
};

export const addDataToStat = (projectData, packageName) => {
  return new Promise(resolve =>  {
    let packageInfo;

    if (data.packageMemoizeInfo.has(packageName)) {
      packageInfo = data.packageMemoizeInfo.get(packageName);
    } else {
      packageInfo = projectData;
      data.packageMemoizeInfo.set(projectData.name, projectData);
    }

    const { name, description } = packageInfo;

    stat.nameNode.innerText = name;
    stat.descriptionNode.innerText = description;

    const defaultValue = '-//-';
    ['npm', 'github', 'score'].forEach(criterion => {
      if (packageInfo[criterion]) {
        Object.keys(stat[criterion]).forEach(subCriterion => {
          let curValue = packageInfo[criterion][subCriterion];
          if (curValue) {
            stat[criterion][subCriterion].innerText = curValue;
          } else {
            stat[criterion][subCriterion].innerText = defaultValue;
          }
        });
      } else {
        Object.keys(stat[criterion]).forEach(subCriterion => {
          stat[criterion][subCriterion].innerText = defaultValue;
        });
      }
    });

    resolve();
  });
};

export const updateStat = (newPackageName) => {
  return exitFromFrame()
    .then(() => addDataToStat(null, newPackageName))
    .then(() => enterToFrame());
};