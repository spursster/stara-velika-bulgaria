import { loadData, initGame } from './core/game.js';
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initGame();
});