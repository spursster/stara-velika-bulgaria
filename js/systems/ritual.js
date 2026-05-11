// systems/ritual.js

export async function renderDynasties() {
  const el = document.getElementById('dynasties');
  if (!el) {
    alert('Няма #dynasties елемент');
    return;
  }

  try {
    const r = await fetch('./data/dynasties.json?v=' + Date.now());
    const data = await r.json();
    const keys = Object.keys(data);

    alert('Намерени династии: ' + keys.length); // трябва да е 13

    let html = '<h2>Български Династии (' + keys.length + ')</h2>';

    for (const k of keys) {
      const d = data[k];
      const rulers = d.rulers.map(x => x.name).join(', ');
      html += `<div class="card"><h3>${d.name}</h3><p>${rulers}</p></div>`;
    }

    el.innerHTML = html;

    // направи таба да работи
    const btn = document.querySelector('[data-tab="dynasties"]');
    if (btn) {
      btn.onclick = () => {
        document.querySelectorAll('.tab, main').forEach(t => t.style.display = 'none');
        el.style.display = 'block';
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
    }

  } catch(e) {
    alert('Грешка: ' + e.message);
    el.innerHTML = '<p>Грешка: ' + e.message + '</p>';
  }
}
