import { loadData, initGame } from './core/game.js';
import { renderDynasties } from './systems/ritual.js';
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initGame();
  const fs = document.getElementById('fs');
  if(fs) fs.onclick = () => {
    if(!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };
  renderDynasties();
});
