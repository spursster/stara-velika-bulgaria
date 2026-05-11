import { state, save } from '../core/state.js';
export function renderPantheon(content, update){
  const data = window.GAME_DATA.GODS;
  content.innerHTML = `<div class="card">
    <h2>Пантеон на Тангра</h2>
    <p class="small">Извърши ритуал за 100 злато. Призоваваш бог, трупаш благосклонност.</p>
    <button class="btn" id="ritual">Ритуал (100💰)</button>
    <div id="ritual-log" style="margin-top:10px"></div>
  </div>
  <div class="card"><h3>Богове (${data.length})</h3><div class="grid" id="gods"></div></div>`;
  
  document.getElementById('ritual').onclick = ()=>{
    if(state.gold < 100){ alert('Няма злато'); return; }
    state.gold -= 100;
    const god = data[Math.floor(Math.random()*data.length)];
    const sg = state.gods.find(g=>g.id===god.id);
    sg.favor += Math.floor(Math.random()*15)+5;
    if(!sg.unlocked && sg.favor>20) sg.unlocked=true;
    state.faith += 1;
    // chance hero
    if(Math.random()<0.3){
      const hero = window.GAME_DATA.HEROES[Math.floor(Math.random()*window.GAME_DATA.HEROES.length)];
      if(!state.warriors.find(w=>w.id===hero.id)){
        state.warriors.push({...hero, lvl:1});
        document.getElementById('ritual-log').innerHTML = `✨ ${god.name_bg} те благослови! Призован: <b>${hero.name_bg}</b>`;
      } else {
        document.getElementById('ritual-log').innerHTML = `✨ ${god.name_bg}: +${sg.favor} благосклонност`;
      }
    } else {
      document.getElementById('ritual-log').innerHTML = `✨ ${god.name_bg}: +${sg.favor} благосклонност`;
    }
    update(); save(); renderGods();
  };
  
  function renderGods(){
    document.getElementById('gods').innerHTML = data.map(g=>{
      const sg = state.gods.find(s=>s.id===g.id);
      return `<div class="item">${g.name_bg}<br><span class="small">${sg.unlocked?'✓':''} ${sg.favor}</span></div>`
    }).join('');
  }
  renderGods();
}