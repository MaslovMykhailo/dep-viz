const url = 'https://api.npms.io/v2/package/';

import data from './data';
const { packageMemoizeInfo } = data;

export const fetchPackageInfo = name => {
  return fetch(url + name)
    .then(response => {
      if (!response.ok) throw new Error();
      return response;
    })
    .then(response => response ? response.json() : null)
    .then(data => {
      if (!data || data.code === 'NOT_FOUND') throw new Error();

      const { npm, metadata } = data.collected;
      const { dependencies } = metadata;
      const { detail } = data.score;

      return {
        name,
        dependencies: dependencies ? Object.keys(dependencies) : [],
        score: {
          quality: Math.round(detail.quality * 100),
          maintenance: Math.round(detail.maintenance * 100),
          popularity: Math.round(detail.popularity * 100),
        },
        npm: {
          dependentsCount: npm.dependentsCount,
          downloads: npm.downloads[5].count
        },
      };
    })
    .catch(() => {});
};

export const getPackageInfo = name => {
  if (packageMemoizeInfo.has(name)) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(packageMemoizeInfo.get(name));
      }, 100);
    });
  } else {
    return fetchPackageInfo(name).then(res => {
      packageMemoizeInfo.set(name, res);
      return res;
    });
  }
};

export const createPackageInfoTree = name => {
  let packageData = null;
  return getPackageInfo(name)
    .then(packageInfo => {
      if (!packageInfo) return null;
      packageData = packageInfo;
      return Promise.all(packageInfo.dependencies.map(dep => {
        const timeoutFetchInfo = new Promise(resolve => {
          setTimeout(() => { resolve(null) }, 15000);
        });
        return Promise.race([createPackageInfoTree(dep), timeoutFetchInfo]);
      }))
    })
    .then(depList => {
      if (depList) {
        return Object.assign({}, packageData, { dependencies: depList.filter(dep => dep) })
      } else {
        return null;
      }
    });
};

export const buildTreeFromPackageData = packageData => {
  return Promise.all(packageData.dependencies.map(dep => createPackageInfoTree(dep)))
    .then(depList =>
      Object.assign({}, packageData, { dependencies: depList })
    )
};

export const changeDepTree = (node, condition1, condition2, withSize) => {
  return {
    name: node.name,
    size: withSize ? node[condition1][condition2] : undefined,
    condition: condition2,
    children: node.dependencies.map(depTree =>
      changeDepTree(depTree, condition1, condition2, true)
    )
  }
};