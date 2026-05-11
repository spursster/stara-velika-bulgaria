import { loadData, initGame } from './core/game.js';
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initGame();
  const fs = document.getElementById('fs');
  if(fs) fs.onclick = () => {
    if(!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };
});
