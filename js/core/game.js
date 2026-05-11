import { state, save } from './state.js';
import { renderPantheon } from '../systems/ritual.js';
import { renderHeroes } from '../systems/heroes.js';
import { renderEquip } from '../heroes3/equipment.js';
import { renderDynasty } from '../ck/dynasty.js';
import { renderArch } from '../systems/archaeology.js';

let GODS=[], HEROES=[], ARTIFACTS=[];

export async function loadData(){
  GODS = await fetch('./data/gods/gods.json').then(r=>r.json()).catch(()=>[]);
  HEROES = await fetch('./data/heroes/warriors.json').then(r=>r.json()).catch(()=>[]);
  ARTIFACTS = await fetch('./data/artifacts/artifacts.json').then(r=>r.json()).catch(()=>[]);
  window.GAME_DATA = { GODS, HEROES, ARTIFACTS };
  // init state gods if empty
  if(state.gods.length===0){
    state.gods = GODS.map(g=>({id:g.id, favor:0, unlocked:false}));
  }
}

function updateResources(){
  document.getElementById('gold').textContent = state.gold;
  document.getElementById('faith').textContent = state.faith;
  document.getElementById('year').textContent = state.year;
}

export function initGame(){
  updateResources();
  const tabs = document.querySelectorAll('nav button');
  const content = document.getElementById('content');
  
  function show(tab){
    tabs.forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
    if(tab==='pantheon') renderPantheon(content, updateResources);
    if(tab==='heroes') renderHeroes(content, updateResources);
    if(tab==='equip') renderEquip(content, updateResources);
    if(tab==='dynasty') renderDynasty(content, updateResources);
    if(tab==='arch') renderArch(content, updateResources);
    save();
  }
  tabs.forEach(b=>b.onclick=()=>show(b.dataset.tab));
  show('pantheon');
  setInterval(()=>{ state.year += 0.1; updateResources(); save(); }, 30000);
}