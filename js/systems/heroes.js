import { state, save } from '../core/state.js';
export function renderHeroes(content, update){
  content.innerHTML = `<div class="card"><h2>Войни (${state.warriors.length})</h2><div class="grid" id="list"></div></div>`;
  const list = document.getElementById('list');
  if(state.warriors.length===0){ list.innerHTML = '<p class="small">Нямаш герои. Прави ритуали в Пантеона.</p>'; return; }
  list.innerHTML = state.warriors.map(w=>`
    <div class="item">
      <b>${w.name_bg}</b><br>
      <span class="small">Ниво ${w.lvl} • ${w.era||'Средновековие'}</span><br>
      <button class="btn" onclick="this.parentElement.querySelector('span').textContent='Трениран'">Тренирай</button>
    </div>`).join('');
}