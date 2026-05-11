import { state, save } from '../core/state.js';
export function renderEquip(content, update){
  const eq = state.equipped;
  content.innerHTML = `<div class="card">
    <h2>Екипировка Heroes III</h2>
    <div class="slots">
      ${['weapon','shield','helm','armor','artifact1','artifact2'].map(s=>`
        <div><div class="small">${s}</div><div class="slot" data-slot="${s}">${eq[s]?eq[s].name:'празно'}</div></div>`).join('')}
    </div>
    <h3>Инвентар</h3>
    <div class="inventory" id="inv"></div>
  </div>`;
  
  function renderInv(){
    document.getElementById('inv').innerHTML = state.inventory.map((it,i)=>`
      <div class="item" data-i="${i}">${it.name}<br><span class="small">${it.slot}</span></div>
    `).join('');
    document.querySelectorAll('#inv .item').forEach(el=>{
      el.onclick = ()=>{
        const it = state.inventory[+el.dataset.i];
        const slot = it.slot.startsWith('artifact') ? (eq.artifact1? 'artifact2':'artifact1') : it.slot;
        if(eq[slot]) state.inventory.push(eq[slot]);
        eq[slot] = it;
        state.inventory.splice(+el.dataset.i,1);
        save(); renderEquip(content, update);
      }
    });
  }
  renderInv();
}