// Имперски Съвет - 13 династии като участници в управлението
export const COUNCIL_DYNASTIES = [
  {id:'dulo', name:'Дуло', votes:3, loyalty:100, bonus:'+20% злато', color:'#d4af37'},
  {id:'vokil', name:'Вокил', votes:1, loyalty:70, bonus:'+15% армия', color:'#8c7322'},
  {id:'ugain', name:'Угаин', votes:1, loyalty:60, bonus:'+10% храна', color:'#bfae84'},
  {id:'komitopuli', name:'Комитопули', votes:2, loyalty:85, bonus:'+25% защита', color:'#d4af37'},
  {id:'asenevtsi', name:'Асеневци', votes:2, loyalty:75, bonus:'+30% злато', color:'#ffd700'},
  {id:'terter', name:'Тертер', votes:1, loyalty:65, bonus:'+15% търговия', color:'#8c7322'},
  {id:'smilets', name:'Смилец', votes:1, loyalty:55, bonus:'+10% всичко', color:'#bfae84'},
  {id:'shishman', name:'Шишмановци', votes:2, loyalty:80, bonus:'+20% култура', color:'#d4af37'},
  {id:'makedoni', name:'Македони', votes:2, loyalty:40, bonus:'+40% армия', color:'#c0c0c0'},
  {id:'ptolomei', name:'Птоломеи', votes:1, loyalty:50, bonus:'+30% наука', color:'#8c7322'},
  {id:'odrisi', name:'Одриси', votes:1, loyalty:90, bonus:'+20% храна', color:'#bfae84'},
  {id:'besarab', name:'Бесараб', votes:1, loyalty:70, bonus:'+15% злато', color:'#d4af37'},
  {id:'osman', name:'Османци', votes:1, loyalty:30, bonus:'+25% армия', color:'#8c0000'},
];

export function initCouncil(state){
  if(!state.council) {
    state.council = {};
    COUNCIL_DYNASTIES.forEach(d => state.council[d.id] = d.loyalty);
  }
}

export function getCouncilPower(state){
  let total=0, votes=0;
  COUNCIL_DYNASTIES.forEach(d=>{
    const loy = state.council[d.id] || 0;
    total += loy * d.votes;
    votes += d.votes;
  });
  return Math.round(total / votes);
}
