window.TurnManager = (function () {
  function nextTurn() {
    const year = Registry.get('year');
    Registry.set('year', year + 1);
    Registry.set('turn', Registry.get('turn') + 1);

    // AI за NPC, ако е включен
    if (Registry.get('npcAutomation')) {
      AINPC.runTurn();
    }

    EventEngine.processTurn();
  }

  return { nextTurn };
})();
