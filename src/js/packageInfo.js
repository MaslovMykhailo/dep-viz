const url = 'https://api.npms.io/v2/package/';

export const packageMemoizeInfo = new Map();

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
          setTimeout(() => { resolve(null) }, 10000);
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