(function setupLayout() {
  function applyLayout() {
    const width = window.innerWidth;
    const root = document.querySelector('.app-root');
    if (!root) return;

    if (width < 768) {
      root.classList.add('layout-mobile');
      root.classList.remove('layout-desktop');
    } else {
      root.classList.add('layout-desktop');
      root.classList.remove('layout-mobile');
    }
  }

  window.addEventListener('resize', applyLayout);
  applyLayout();
})();
