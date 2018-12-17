export default  {
  statNode: document.getElementsByClassName('stat-container')[0],
  nameNode: document.getElementsByClassName('stat-container__package-name')[0],
  descriptionNode: document.getElementsByClassName('stat-container__description')[0],
  tableNode: document.getElementsByClassName('stat-table')[0],
  npm: {
    downloads: document.getElementById('downloads'),
    dependentsCount: document.getElementById('dependentsCount')
  },
  github: {
    starsCount: document.getElementById('starsCount'),
    forksCount: document.getElementById('forksCount')
  },
  score: {
    popularity: document.getElementById('popularity'),
    maintenance: document.getElementById('maintenance'),
    quality: document.getElementById('quality')
  },
  buildBy: document.getElementById('build-by')
}