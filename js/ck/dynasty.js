import { state, save } from '../core/state.js';
export function renderDynasty(content, update){
  const d = state.dynasty;
  content.innerHTML = `<div class="card">
    <h2>Династия Дуло</h2>
    <p>Владетел: <b>${d.ruler}</b> | Престиж: ${d.prestige}</p>
    <p>Съпруг/а: ${d.spouse||'—'} ${!d.spouse?'<button class="btn" id="marry">Ожени се</button>':''}</p>
    <h3>Деца (${d.children.length})</h3>
    <div id="kids">${d.children.map(c=>`<span class="item">${c}</span>`).join('')||'<span class="small">Няма</span>'}</div>
  </div>`;
  const btn = document.getElementById('marry');
  if(btn) btn.onclick = ()=>{
    const spouses = ['Ермика','Аспарухова дъщеря','Аланска принцеса'];
    d.spouse = spouses[Math.floor(Math.random()*spouses.length)];
    d.prestige += 50;
    state.gold -= 500;
    save(); renderDynasty(content, update); update();
  };
  // auto child
  if(d.spouse && Math.random()<0.3 && d.children.length<5){
    const names = ['Батбаян','Котраг','Аспарух','Кубер','Алцек'];
    const name = names[Math.floor(Math.random()*names.length)];
    if(!d.children.includes(name)) d.children.push(name);
  }
}