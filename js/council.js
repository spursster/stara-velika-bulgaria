// js/council.js
class Council {
  constructor() {
    this.data = null; // council object from JSON or registry
    this.registry = null;
    this.log = [];
  }

  initFromData(data, registry) {
    this.data = JSON.parse(JSON.stringify(data || {}));
    this.registry = registry || null;
    if (!this.data.members) this.data.members = [];
    // ensure numeric fields
    this.data.members.forEach(m => {
      m.influence = Number.isFinite(m.influence) ? m.influence : 5;
      m.loyalty = Number.isFinite(m.loyalty) ? m.loyalty : 5;
      m.vote_weight = Number.isFinite(m.vote_weight) ? m.vote_weight : 1;
    });
  }

  // choose representatives automatically (first ruler of each dynasty) - helper if you want to re-elect
  electRepresentativesFromDynasties(dynasties, mode = 'first') {
    const members = [];
    const used = new Set();
    dynasties.forEach(d => {
      if (!d || !d.id) return;
      const dynId = d.id;
      if (!Array.isArray(d.rulers) || d.rulers.length === 0) return;
      let chosen = null;
      if (mode === 'first') chosen = d.rulers[0];
      else if (mode === 'random') chosen = d.rulers[Math.floor(Math.random() * d.rulers.length)];
      if (!chosen) return;
      const member = {
        dynasty_id: dynId,
        ruler_id: chosen.id || chosen.name,
        role: 'представител',
        influence: 5,
        loyalty: 5,
        vote_weight: 1,
        notes: ''
      };
      if (!used.has(dynId)) {
        members.push(member);
        used.add(dynId);
      }
    });
    this.data = this.data || {};
    this.data.members = members;
    return members;
  }

  getMembers() {
    return (this.data && Array.isArray(this.data.members)) ? this.data.members : [];
  }

  getMemberByDynasty(dynId) {
    return this.getMembers().find(m => m.dynasty_id === dynId) || null;
  }

  // Simple proposal object: { id, title, description, unpopularity (0-10), proposer_dynasty }
  proposeMotion(proposal) {
    if (!this.data) return { error: 'Council not initialized' };
    const p = Object.assign({ id: 'p_' + Date.now(), title: '', description: '', unpopularity: 3, proposer_dynasty: null }, proposal || {});
    this.log.unshift({ time: Date.now(), type: 'proposal', proposal: p });
    return p;
  }

  // Resolve vote according to rules; returns { votes: {for,against,abstain}, passed: bool, details: [] }
  holdCouncil(proposal) {
    if (!this.data) return { error: 'Council not initialized' };
    const members = this.getMembers();
    const quorum = (this.data.rules && Number.isFinite(this.data.rules.quorum)) ? this.data.rules.quorum : Math.ceil(members.length / 2);
    if (members.length < quorum) {
      const msg = `Няма кворум (${members.length}/${quorum})`;
      this.log.unshift({ time: Date.now(), type: 'no_quorum', message: msg });
      return { error: 'no_quorum', message: msg };
    }

    const votes = { for: 0, against: 0, abstain: 0 };
    const details = [];

    members.forEach(m => {
      // base score: loyalty (0-10) minus proposal unpopularity plus small influence factor
      const base = (m.loyalty || 5) - (proposal.unpopularity || 3) + ((m.influence || 5) * 0.1);
      const roll = Math.random() * 10;
      let choice = 'against';
      if (roll < Math.max(0, base)) choice = 'for';
      else if (Math.abs(roll - base) < 1.5) choice = 'abstain';
      // apply vote weight
      votes[choice] += (m.vote_weight || 1);
      details.push({ dynasty: m.dynasty_id, ruler: m.ruler_id, choice, roll: Number(roll.toFixed(2)), base: Number(base.toFixed(2)), weight: m.vote_weight || 1 });
    });

    const totalVotes = votes.for + votes.against + votes.abstain;
    const effectiveTotal = votes.for + votes.against; // abstain excluded for majority
    let passed = false;
    const vt = (this.data.rules && this.data.rules.vote_type) ? this.data.rules.vote_type : 'simple_majority';
    if (vt === 'simple_majority') {
      passed = effectiveTotal > 0 ? (votes.for > effectiveTotal / 2) : false;
    } else if (vt === 'supermajority') {
      passed = effectiveTotal > 0 ? (votes.for >= Math.ceil(effectiveTotal * 0.66)) : false;
    } else if (vt === 'consensus') {
      passed = votes.against === 0;
    }

    // consequences: adjust loyalty slightly
    details.forEach(d => {
      const member = this.getMembers().find(m => m.dynasty_id === d.dynasty);
      if (!member) return;
      if (d.choice === 'for') member.loyalty = Math.min(10, (member.loyalty || 5) + 0.3);
      if (d.choice === 'against') member.loyalty = Math.max(0, (member.loyalty || 5) - 0.2);
      // small random influence drift
      member.influence = Math.max(0, Math.min(10, (member.influence || 5) + (Math.random() - 0.5) * 0.2));
    });

    const result = { votes, passed, details, proposal };
    this.log.unshift({ time: Date.now(), type: 'vote_result', result });
    return result;
  }

  getLog(limit = 20) {
    return this.log.slice(0, limit);
  }

  // Save current council state into registry (if available)
  saveToRegistry() {
    if (!this.registry || !this.data) return false;
    this.registry.set('council', this.data);
    return true;
  }

  // Load council from registry (if present)
  loadFromRegistry() {
    if (!this.registry) return false;
    const c = this.registry.get('council');
    if (c) this.data = JSON.parse(JSON.stringify(c));
    return !!c;
  }
}

// expose single instance
window.Council = window.Council || new Council();
