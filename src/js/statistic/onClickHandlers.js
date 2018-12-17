import statistic from './statistic';
import * as diagram from '../diagram/actions';

const { buildBy } = statistic;
const items = buildBy.children;

const onClickHandler = item => () => {
  for (let i = 0 ; i < items.length ; i++) {
    items[i].removeAttribute('disabled', false);
  }
  item.setAttribute('disabled', true);

  diagram.rebuild(item.dataset.criterion);
  document.getElementsByClassName('mdl-menu__container')[0].classList.remove('is-visible');
  document.getElementById('build-by-text').innerText = item.childNodes[0].data;
};

for (let i = 0 ; i < items.length ; i++) {
  items[i].onclick = onClickHandler(items[i]);
}







