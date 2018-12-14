import logo from './logo';

export const exitFromFrame = () => {
  logo.node.style.height = '556px';
  logo.node.style.opacity = '0';

  return new Promise(resolve => {
    setTimeout(() => {
      logo.node.classList.add('_invisible');
      resolve();
    }, 1500);
  });
};