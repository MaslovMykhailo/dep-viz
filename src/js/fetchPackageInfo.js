const packageMemoizeInfo = {};

const url = 'https://api.npms.io/v2/package/';

const fetchPackageInfo = name => {
  const fetchInfo = name => packageMemoizeInfo[name] ?
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
          downloads: npm.downloads[0].count
        },
      };
      packageMemoizeInfo[name] = result;

      return Promise.resolve(result);
    });

  return fetchInfo(name).then(result => {
    return Promise.all(result.dependencies.map(name => {
      return packageMemoizeInfo[name] ?
        Promise.resolve(packageMemoizeInfo[name]) :
        fetchPackageInfo(name);
    }))
      .then(depList => Object.assign(packageMemoizeInfo[name], { dependencies: depList }));
  });

};

export default fetchPackageInfo;