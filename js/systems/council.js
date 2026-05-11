// Имперски Съвет - 13 династии
export const COUNCIL_DATA = [
 {id:'dulo',n:'Дуло',v:3,b:'+20% злато',l:100},
 {id:'asenevtsi',n:'Асеневци',v:2,b:'+30% злато',l:75},
 {id:'komitopuli',n:'Комитопули',v:2,b:'+25% защита',l:85},
 {id:'shishman',n:'Шишмановци',v:2,b:'+20% култура',l:80},
 {id:'makedoni',n:'Македони',v:2,b:'+40% армия',l:40},
 {id:'odrisi',n:'Одриси',v:1,b:'+20% храна',l:90},
 {id:'vokil',n:'Вокил',v:1,b:'+15% армия',l:70},
 {id:'ugain',n:'Угаин',v:1,b:'+10% храна',l:60},
 {id:'terter',n:'Тертер',v:1,b:'+15% търговия',l:65},
 {id:'smilets',n:'Смилец',v:1,b:'+10% всичко',l:55},
 {id:'ptolomei',n:'Птоломеи',v:1,b:'+30% наука',l:50},
 {id:'besarab',n:'Бесараб',v:1,b:'+15% злато',l:70},
 {id:'osman',n:'Османци',v:1,b:'+25% армия',l:30},
];

export function initCouncil(state){
 if(!state.council) state.council = {};
 COUNCIL_DATA.forEach(d=>{ if(state.council[d.id]===undefined) state.council[d.id]=d.l; });
}

export function renderCouncil(state, container){
 initCouncil(state);
 container.innerHTML='';
 let tot=0, tv=0;
 COUNCIL_DATA.forEach(d=>{
  const loy = state.council[d.id];
  tot += loy * d.v; tv += d.v;
  const highlight = loy >= 70 ? 'highlight' : '';
  container.innerHTML += `<div class="nation ${highlight}"><div class="title">${d.n} <span style="color:var(--gold)">(${d.v} гласа)</span></div><div class="desc">${d.b}</div><div class="meta"><span>Лоялност: ${loy}%</span><button onclick="window.bribeCouncil('${d.id}')" style="font-size:11px;padding:2px 6px">Подкупи 100зл</button></div></div>`;
 });
 return Math.round(tot/tv);
}
