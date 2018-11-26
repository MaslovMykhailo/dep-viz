export const packageMemoizeInfo = {};

const url = 'https://api.npms.io/v2/package/';

const fetchPackageInfo = name => packageMemoizeInfo[name] ?
  Promise.resolve(packageMemoizeInfo[name]) :
  fetch(url + name)
    .then(response => response.json())
    .then(data => {
      const { npm, metadata } = data.collected;
      const { dependencies } = metadata;
      const { detail } = data.score;
      
      const result = {
        name,
        dependencies: dependencies ? Object.keys(dependencies) : [],
        score: {
          quality: Math.round(detail.quality * 100),
          maintenance: Math.round(detail.maintenance * 100),
          popularity: Math.round(detail.popularity * 100),
        },
        npm: {
          dependentsCount: npm.dependentsCount,
          downloads: npm.downloads.reduce((res, d) => res + d.count, 0)
        },
      };
      return Promise.resolve(result);
    })
    .then(result => {
      return Promise.all(result.dependencies.map(depName => fetchPackageInfo(depName)))
        .then(depList => {
          const res = Object.assign({}, result, { dependencies: depList });
          packageMemoizeInfo[name] = res;
          return Promise.resolve(res);
        });
    });

export default fetchPackageInfo;