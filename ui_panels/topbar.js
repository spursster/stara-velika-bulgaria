// ui_panels/topbar.js
// Clean topbar renderer compatible with new Registry + main.js

(function () {
  const top = document.getElementById("topbar");
  if (!top) return;

  function render() {
    top.innerHTML = "";
    top.style.display = "flex";
    top.style.alignItems = "center";
    top.style.padding = "0 12px";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "12px";

    const year = Registry.get("year") || 680;

    const yearLabel = document.createElement("div");
    yearLabel.style.fontWeight = "700";
    yearLabel.style.fontSize = "15px";
    yearLabel.innerHTML = `Година: <span id="topbar-year">${year}</span>`;
    left.appendChild(yearLabel);

    function btn(text) {
      const b = document.createElement("button");
      b.textContent = text;
      b.style.padding = "6px 10px";
      b.style.background = "#34495e";
      b.style.color = "#fff";
      b.style.border = "none";
      b.style.borderRadius = "3px";
      b.style.cursor = "pointer";
      return b;
    }

    const newGame = btn("Нова игра");
    const save = btn("Запази");
    const next = btn("Следващ ход");

    newGame.onclick = () => {
      Registry.set("year", 680);
    };

    save.onclick = () => {
      if (typeof window.saveGame === "function") window.saveGame();
    };

    next.onclick = () => {
      const y = Registry.get("year") || 680;
      Registry.set("year", y + 1);
    };

    left.appendChild(newGame);
    left.appendChild(save);
    left.appendChild(next);

    const right = document.createElement("div");
    right.style.marginLeft = "auto";
    right.textContent = "🔔";

    top.appendChild(left);
    top.appendChild(right);

    Registry.on("year", v => {
      const el = document.getElementById("topbar-year");
      if (el) el.textContent = v;
    });
  }

  render();
})();
