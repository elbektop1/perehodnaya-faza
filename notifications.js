function notificationTypeLabel(type) {
  return (Store.getNotificationTypes().find(t => t.key === type) || {}).label || type;
}

let notifPanelOpen = false;

function renderNotifBell() {
  const badge = document.getElementById("notifBellBadge");
  if (!badge) return;
  const me = getCurrentStaffId();
  const count = me ? Store.getUnreadCount(me) : 0;
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
  if (notifPanelOpen) renderNotifPanelList();
}

function toggleNotifPanel(event) {
  event.stopPropagation();
  if (notifPanelOpen) closeNotifPanel(); else openNotifPanel();
}

function openNotifPanel() {
  notifPanelOpen = true;
  document.getElementById("notifPanel")?.classList.remove("hidden");
  renderNotifPanelList();
}

function closeNotifPanel() {
  notifPanelOpen = false;
  document.getElementById("notifPanel")?.classList.add("hidden");
}

document.addEventListener("click", e => {
  if (notifPanelOpen && !e.target.closest("#notifWrap")) closeNotifPanel();
});

function notifItemHtml(n, opts = {}) {
  const cls = ["notif-item"];
  if (!opts.muted && !n.read) cls.push("unread");
  if (opts.muted) cls.push("notif-item--muted");
  return `<button class="${cls.join(" ")}" onclick="openNotification('${n.id}', ${!!opts.muted})">
    <strong>${esc(n.title)}</strong>
    <span>${esc(n.text)}</span>
    <small>${notificationTypeLabel(n.type)} · ${nowLabel(new Date(n.createdAt))}</small>
  </button>`;
}

function openNotification(id, skipMarkRead) {
  const n = Store.getNotifications(null).find(x => x.id === id);
  if (!n) return;
  if (!skipMarkRead) Store.markRead(id);
  closeNotifPanel();
  if (n.link && n.link.section) navTo(n.link.section);
  renderNotifBell();
  renderNotificationsScreen();
}

function renderNotifPanelList() {
  const panel = document.getElementById("notifPanel");
  if (!panel) return;
  const me = getCurrentStaffId();
  const items = me ? Store.getNotifications(me).slice(0, 7) : [];
  const list = items.map(n => notifItemHtml(n)).join("") || '<p class="muted">Уведомлений пока нет.</p>';
  panel.innerHTML = `${list}<div class="notif-panel-footer"><button class="btn btn-ghost btn-sm" onclick="closeNotifPanel(); navTo('notifications')">Все уведомления</button></div>`;
}

// --- экран «Уведомления»: список текущего сотрудника ---

let notifTypeFilter = "all";
let notifUnreadOnly = false;

function renderNotifTypeFilters(myNotifications) {
  const el = document.getElementById("notifTypeFilters");
  if (!el) return;
  const types = [...new Set(myNotifications.map(n => n.type))];
  const chips = [{ key: "all", label: "Все" }, ...types.map(t => ({ key: t, label: notificationTypeLabel(t) }))];
  el.innerHTML = chips.map(c =>
    `<button data-notif-type="${c.key}" class="${c.key === notifTypeFilter ? "active" : ""}">${esc(c.label)}</button>`
  ).join("");
  el.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    notifTypeFilter = btn.dataset.notifType;
    renderNotificationsScreen();
  }));
}

function toggleNotifUnreadOnly() {
  notifUnreadOnly = !notifUnreadOnly;
  renderNotificationsScreen();
}

function markAllReadAndRefresh() {
  const me = getCurrentStaffId();
  if (me) Store.markAllRead(me);
  renderNotifBell();
  renderNotificationsScreen();
}

function renderNotificationsList() {
  const list = document.getElementById("notificationsList");
  if (!list) return;
  const me = getCurrentStaffId();
  if (!me) {
    list.innerHTML = '<div class="empty-state">Выберите себя в «Вы», чтобы увидеть уведомления.</div>';
    renderNotifTypeFilters([]);
    return;
  }
  const all = Store.getNotifications(me);
  renderNotifTypeFilters(all);
  const filtered = all
    .filter(n => notifTypeFilter === "all" || n.type === notifTypeFilter)
    .filter(n => !notifUnreadOnly || !n.read);
  list.innerHTML = filtered.map(n => notifItemHtml(n)).join("") || '<div class="empty-state">Уведомлений нет.</div>';

  const toggle = document.getElementById("notifUnreadToggle");
  if (toggle) toggle.classList.toggle("active", notifUnreadOnly);
}

// --- вычисляемые предупреждения: срок отгрузки/просрочка оплаты — не хранятся ---

function computeLiveWarnings() {
  const role = getCurrentRole();
  const me = getCurrentStaffId();
  const warnings = [];
  Store.getOrders().filter(o => o.status !== "done").forEach(o => {
    const seesDeadline = role === "director" || o.createdBy === me;
    if (seesDeadline && o.shipDate) {
      const ship = parseShipDate(o.shipDate);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const diff = Math.round((ship - today) / 86400000);
      if (diff >= 0 && diff <= 3) {
        warnings.push({ type: "deadline", title: "Приближается срок отгрузки", text: `${o.id} — ${o.shipDate}`, link: { section: "orders" } });
      }
    }
    const seesPayment = role === "director" || role === "accountant" || o.createdBy === me;
    if (seesPayment && isPaymentOverdue(o)) {
      warnings.push({ type: "payment", title: "Просрочена оплата", text: `${o.id} — ${o.customer}`, link: { section: "finance" } });
    }
  });
  return warnings;
}

function renderLiveWarnings() {
  const el = document.getElementById("notifWarningsList");
  const card = document.getElementById("notifWarningsCard");
  if (!el || !card) return;
  const warnings = computeLiveWarnings();
  card.style.display = warnings.length ? "" : "none";
  el.innerHTML = warnings.map(w => `
    <button class="notif-item" onclick="closeNotifPanel(); navTo('${w.link.section}')">
      <strong>${esc(w.title)}</strong>
      <span>${esc(w.text)}</span>
      <small>${notificationTypeLabel(w.type)}</small>
    </button>
  `).join("");
}

// --- директор: read-only история уведомлений по заказам (все сотрудники) ---

function renderDirectorOversight() {
  const card = document.getElementById("notifDirectorOversightCard");
  const list = document.getElementById("notifDirectorOversightList");
  if (!card || !list) return;
  const isDirector = getCurrentRole() === "director";
  card.classList.toggle("hidden", !isDirector);
  if (!isDirector) return;
  const items = Store.getNotifications(null, { types: ["order_status", "blank"] });
  list.innerHTML = items.map(n => notifItemHtml(n, { muted: true })).join("") || '<div class="empty-state">Уведомлений по заказам пока нет.</div>';
}

function renderNotificationsScreen() {
  renderNotificationsList();
  renderLiveWarnings();
  renderDirectorOversight();
}

// --- хуки: уведомление создаётся в момент события в других файлах (typeof-guard) ---

function refreshAfterNotification() {
  renderNotifBell();
  renderNotificationsScreen();
}

function notifyNewTask(task) {
  if (!task.assigneeId || task.assigneeId === getCurrentStaffId()) return;
  Store.addNotification({
    type: "task", title: "Новая задача", text: task.title,
    recipientId: task.assigneeId, createdAt: Date.now(), link: { section: "tasks", entityId: task.id },
  });
  refreshAfterNotification();
}

function notifyNewQuestion(question) {
  if (!question.addresseeId || question.addresseeId === getCurrentStaffId()) return;
  Store.addNotification({
    type: "question", title: "Новый вопрос", text: question.title,
    recipientId: question.addresseeId, createdAt: Date.now(), link: { section: "questions", entityId: question.id },
  });
  refreshAfterNotification();
}

function notifyOrderStatusChange(order) {
  const me = getCurrentStaffId();
  const recipients = new Set();
  if (order.createdBy && order.createdBy !== me) recipients.add(order.createdBy);
  if (order.assignee && order.assignee !== me) recipients.add(order.assignee);
  const statusLabel = getStatus(order.status)?.label || order.status;
  recipients.forEach(id => {
    Store.addNotification({
      type: "order_status", title: "Статус заказа изменён", text: `${order.id} — ${statusLabel}`,
      recipientId: id, createdAt: Date.now(), link: { section: "orders", entityId: order.id },
    });
  });
  if (recipients.size) refreshAfterNotification();
}

function notifyNewsPublished(newsItem) {
  const me = getCurrentStaffId();
  audienceStaff(newsItem.audience).filter(p => p.id !== me).forEach(p => {
    Store.addNotification({
      type: "news", title: "Новая новость", text: newsItem.title,
      recipientId: p.id, createdAt: Date.now(), link: { section: "news", entityId: newsItem.id },
    });
  });
  refreshAfterNotification();
}

function notifyBlankSent(order, blank) {
  if (!order.createdBy || order.createdBy === getCurrentStaffId()) return;
  Store.addNotification({
    type: "blank", title: "Бланк отправлен на согласование", text: `${order.id} — ждём ответ клиента`,
    recipientId: order.createdBy, createdAt: Date.now(), link: { section: "approvals", entityId: order.id },
  });
  refreshAfterNotification();
}

const _navToNotifications = navTo;
navTo = function (id) {
  _navToNotifications(id);
  if (id === "notifications") renderNotificationsScreen();
};

renderNotifBell();
