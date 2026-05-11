import { state, save } from '../core/state.js';
export function renderArch(content, update){
  content.innerHTML = `<div class="card">
    <h2>Археология</h2>
    <p class="small">Копай в Плиска, Фанагория, Преслав. Намери артефакти.</p>
    <button class="btn" id="dig">Копай (200💰)</button>
    <div id="find" style="margin-top:10px"></div>
    <p>Копания: ${state.archaeology.digs}</p>
  </div>`;
  document.getElementById('dig').onclick = ()=>{
    if(state.gold<200){alert('Няма злато');return}
    state.gold-=200; state.archaeology.digs++;
    const arts = window.GAME_DATA.ARTIFACTS;
    const find = arts[Math.floor(Math.random()*arts.length)];
    state.inventory.push({...find, slot:find.slot||'artifact1'});
    document.getElementById('find').innerHTML = `🏺 Намери: <b>${find.name_bg}</b>`;
    update(); save();
  };
}