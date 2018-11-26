export const packageMemoizeInfo = {};

const url = 'https://api.npms.io/v2/package/';

const fetchPackageInfo = name => packageMemoizeInfo[name] ?
  Promise.resolve(packageMemoizeInfo[name]) :
  fetch(url + name)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response
    })
    .then(response => response.json())
    .then(data => {
      if (!data || data.code === 'NOT_FOUND') return null;
      
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
          downloads: npm.downloads.reduce((res, d) => res + d.count, 0)
        },
      };
    })
    .then(result => {
      if (!result) return null;
      return Promise.all(result.dependencies.map(depName => fetchPackageInfo(depName)))
        .then(depList => {
          const res = Object.assign({}, result, { dependencies: depList });
          packageMemoizeInfo[name] = res;
          return res;
        });
    })
    .catch(err => { /* ignore */ })
;

export default fetchPackageInfo;