// ui_panels/notifications_panel.js — пълен, готов файл

(function NotificationsPanel() {
  const root = document.getElementById('panel-right');
  if (!root) return;

  let notifications = [];

  function render() {
    root.innerHTML = `
      <div class="panel notifications-panel">
        <h2>${I18N.t('ui.notifications')}</h2>

        <div class="notifications-list">
          ${notifications.map(renderItem).join('')}
        </div>
      </div>
    `;
  }

  function renderItem(n) {
    return `
      <div class="notification-item ${n.type}">
        <div class="notification-title">${n.title}</div>
        <div class="notification-body">${n.body}</div>
        <div class="notification-time">${formatTime(n.time)}</div>
      </div>
    `;
  }

  function formatTime(t) {
    const date = new Date(t);
    return date.toLocaleTimeString('bg-BG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Добавяне на ново събитие
  function push(title, body, type = "info") {
    notifications.unshift({
      title,
      body,
      type,
      time: Date.now()
    });

    if (notifications.length > 50) {
      notifications.pop();
    }

    render();
  }

  // публичен API
  window.Notifications = {
    render,
    push
  };
})();
