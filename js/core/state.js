export let state = JSON.parse(localStorage.getItem('svb-v43')||'null') || {
  gold: 10000,
  faith: 0,
  year: 632,
  gods: [],
  warriors: [],
  inventory: [
    {id:'sword_bulgar', name:'Български меч', slot:'weapon', atk:5},
    {id:'helm_khan', name:'Шлем на Кана', slot:'helm', def:3}
  ],
  equipped: {weapon:null, armor:null, helm:null, shield:null, artifact1:null, artifact2:null},
  dynasty: {ruler:'Кубрат', spouse:null, children:[], prestige:100},
  archaeology: {digs:0}
};
export function save(){ localStorage.setItem('svb-v43', JSON.stringify(state)); }