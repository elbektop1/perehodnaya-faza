/* orders.js — FSM заказов, перенесено из корневого app.js (Фаза 2).
   Таблицы и guard'ы — без изменений смысла. Данные — через Store (store.js),
   роль читается напрямую из #roleSelect (тот же паттерн, что в shell.js). */

const STATUSES = [
  { key: "new",        label: "Новый" },
  { key: "design",     label: "У дизайнера" },
  { key: "rework",     label: "На доработке" },
  { key: "approval",   label: "На согласовании" },
  { key: "production", label: "В производстве" },
  { key: "ready",      label: "Готов к отгрузке" },
  { key: "done",       label: "Готово" },
];
function getStatus(key) { return STATUSES.find(s => s.key === key); }

const TRANSITIONS = {
  new: [
    { to: "design",     label: "Передать дизайнеру", role: "manager", assignTo: "designer", primary: true },
    { to: "production", label: "Сразу в производство", role: "manager", assignTo: "worker" },
  ],
  design: [
    { to: "design",   label: "Принять в работу", role: "designer", historyText: "Принято в работу", accept: true },
    { to: "approval", label: "На согласование", role: "designer", primary: true },
    { to: "new",      label: "Вернуть с проблемой", role: "designer", comment: true, problem: true },
  ],
  rework: [
    { to: "rework",   label: "Принять в работу", role: "designer", historyText: "Принято в работу", accept: true },
    { to: "approval", label: "Доработал, на согласование", role: "designer", primary: true },
  ],
  approval: [
    { to: "production", label: "Согласовать → в производство", role: "manager", assignTo: "worker", primary: true },
    { to: "rework",     label: "На доработку", role: "manager", comment: true },
    { to: "production", label: "Передать в производство", role: "production_manager", assignTo: "worker", primary: true },
  ],
  production: [
    { to: "production", label: "Принять в работу", role: "worker", historyText: "Принято в работу", accept: true },
    { to: "production", label: "Принять (подготовка форм)", role: "production_manager", historyText: "Принято в работу (подготовка форм)", accept: true },
    { to: "ready",      label: "Готово к отгрузке", role: "worker", primary: true, variant: "ok", requiresAccepted: true },
    { to: "approval",   label: "Вернуть с проблемой", role: "worker", comment: true, problem: true, historyText: "Возвращён с проблемой" },
  ],
  ready: [
    { to: "done", label: "Подтвердить отгрузку", role: "manager", primary: true, variant: "ok" },
  ],
  done: [],
};

const HISTORY_TEXT = {
  design:     "Передан дизайнеру",
  approval:   "Отправлен на согласование",
  production: "Запущен в производство",
  ready:      "Готов к отгрузке — ожидает подтверждения менеджера",
  done:       "Заказ выполнен",
  new:        "Возвращён менеджеру",
};

const STATUS_TIPS = {
  new:        "Заказ создан, ещё не передан в работу",
  design:     "Дизайнер работает над макетом",
  rework:     "Макет вернули на доработку с замечаниями",
  approval:   "Макет готов, ожидает согласования менеджером",
  production: "Передан в печать, работают печатники",
  ready:      "Напечатан, ожидает подтверждения отгрузки",
  done:       "Заказ завершён и отгружен",
};

// null — видит все статусы; designer/worker видят только свой этап. Роли вне
// таблицы (leader/accountant/technologist/printer) — тоже null через ?? ниже.
const ROLE_ORDER_FILTER = {
  manager: null,
  designer: ["design", "rework"],
  worker: ["production"],
  production_manager: null,
};

function parseShipDate(shipDate) {
  if (!shipDate) return null;
  const [y, m, d] = shipDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function isShipOverdue(order) {
  const ship = parseShipDate(order.shipDate);
  if (!ship) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return ship < today;
}
function isPaymentOverdue(order) {
  if (!order.paymentDue || order.paid) return false;
  const due = parseShipDate(order.paymentDue);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return due < today;
}

// приоритет сверху вниз, первое совпадение выигрывает
const STRIPE_COLOR_RULES = [
  { color: "var(--red)",    test: o => o.urgent || isShipOverdue(o) || isPaymentOverdue(o) },
  { color: "var(--yellow)", test: o => o.hasProblem || o.needNewKnife },
  { color: "var(--green)",  test: o => o.status === "ready" },
  { color: "var(--cyan)",   test: o => ["design", "rework", "approval", "production"].includes(o.status) },
  { color: "var(--border)", test: () => true },
];
function getStripeColor(order) {
  return STRIPE_COLOR_RULES.find(r => r.test(order)).color;
}

function renderShipDate(shipDate) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ship = parseShipDate(shipDate);
  const diff = Math.round((ship - today) / 86400000);

  let cls = "ship-date";
  let label = shipDate;
  if (diff < 0) { cls += " ship-overdue"; label = `Просрочено (${shipDate})`; }
  else if (diff === 0) { cls += " ship-today"; label = "СЕГОДНЯ"; }
  else if (diff === 1) { cls += " ship-tomorrow"; label = `ЗАВТРА (${shipDate})`; }
  else if (diff <= 3) { cls += " ship-soon"; label = `${shipDate} (через ${diff} дн.)`; }

  return `<span class="${cls}">${label}</span>`;
}

function nowLabel() {
  const months = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]}, ${hh}:${mm}`;
}

function getCurrentRole() {
  return document.getElementById("roleSelect").value;
}

function staffByRole(role) {
  return Store.getStaff().filter(p => p.role === role);
}
function formatPersonName(person) {
  return `${person.name} (${roleNames[person.role] || person.role})`;
}
function staffName(id) {
  const p = Store.getStaff().find(s => s.id === id);
  return p ? formatPersonName(p) : "—";
}

// та же функция читает доступные действия и для рендера кнопок, и для их обработки —
// иначе индекс кнопки (actionIdx) может указать не на то действие
function getAvailableActions(order, status) {
  const role = getCurrentRole();
  return (TRANSITIONS[status] || [])
    .filter(a => a.role === role)
    .filter(a => !a.requiresAccepted || order.acceptedBy != null);
}

function visibleOrders() {
  const allowed = ROLE_ORDER_FILTER[getCurrentRole()] ?? null;
  return Store.getOrders()
    .filter(o => o.status !== "done")
    .filter(o => !allowed || allowed.includes(o.status));
}

function renderOrders() {
  const list = document.getElementById("ordersList");
  if (!list) return;
  const orders = visibleOrders();
  if (orders.length === 0) {
    list.innerHTML = `<p class="muted">Нет заказов, ожидающих вашего действия</p>`;
    return;
  }
  list.innerHTML = "";
  orders.forEach(order => list.appendChild(renderOrderCard(order)));
}

function renderOrderCard(order) {
  const status = getStatus(order.status);
  const actions = getAvailableActions(order, order.status);

  const actionsHtml = actions.length === 0
    ? `<span class="muted">Ожидает действия другой роли</span>`
    : actions.map((a, i) => {
        const cls = a.primary ? (a.variant === "ok" ? "btn btn-ok" : "btn btn-primary") : "btn btn-ghost";
        // блокируется после принятия, снова активна при переназначении (acceptedBy сбросится)
        const disabledAttr = (a.accept && order.acceptedBy != null) ? " disabled" : "";
        return `<button class="${cls}"${disabledAttr} onclick="doAction('${order.id}', '${order.status}', ${i})">${a.label}</button>`;
      }).join("");

  const problemHtml = order.hasProblem ? `<span class="badge-problem" title="Есть проблема">Проблема</span>` : "";
  const urgentHtml = order.urgent ? `<span class="badge-urgent">Срочно</span>` : "";

  const typeLabel = Store.getOrderTypes().find(t => t.key === order.orderType)?.label || "";
  const typeBadge = (order.orderType && order.orderType !== "new") ? `<span class="badge-type">${typeLabel}</span>` : "";

  const cuttingLabel = {
    knife:     order.knifeId ? `Нож ${Store.getKnives().find(k => k.id === order.knifeId)?.name || ""}` : "Нож",
    laser:     "Лазер",
    new_knife: "Новый нож (+3 дн.)",
  }[order.cuttingType || "knife"] || "";

  const assigneeHtml = order.assignee ? `<span class="assignee">Исполнитель: ${staffName(order.assignee)}</span>` : "";

  const detailsHtml = `
    <div class="order-details${order.detailsExpanded ? "" : " collapsed"}">
      <span class="detail">Размер: <strong>${order.labelSize || "—"}</strong></span>
      <span class="detail">Высечка: <strong>${cuttingLabel}</strong></span>
      <span class="detail">Ламинация: <strong>${order.lamination || "Нет"}</strong></span>
      <span class="detail">Машина: <strong>${order.machine || "—"}</strong></span>
    </div>
  `;

  // компонент Timeline (client_reference) вместо .history-item — тот же паттерн, что у #clientTimeline
  const timelineHtml = order.history.map(ev => `
    <div class="timeline-item">
      <div class="meta"><span>${ev.when}</span>${ev.who ? `<span>·</span><span>${esc(ev.who)}</span>` : ""}</div>
      <div>${esc(ev.text)}</div>
    </div>
  `).join("");

  const card = document.createElement("div");
  card.className = "order-card";
  card.style.setProperty("--stripe-color", getStripeColor(order));
  card.innerHTML = `
    <div class="order-head">
      <span class="order-head-left">
        <span class="order-title">${esc(order.title)}</span>${typeBadge}
      </span>
      <span class="order-head-right">
        <span class="status-badge-wrap" style="position:relative;display:inline-block" onclick="toggleStatusTip(event, '${status.key}')">
          <span class="badge ${status.key}">${status.label}</span>
        </span>${problemHtml}${urgentHtml}
      </span>
    </div>
    <div class="order-meta">
      <span>#${order.id} · ${esc(order.customer)} · ${(order.runLength || 0).toLocaleString()} шт.</span>
    </div>
    <div class="order-line3">
      <span>${order.shipDate ? renderShipDate(order.shipDate) : "Отгрузка не задана"}</span>
      <span>${esc(order.material || "—")}</span>
      ${assigneeHtml}
    </div>

    <div class="history">
      <div class="history-head history-head--toggle" onclick="toggleDetails('${order.id}')">
        <div class="history-title">Детали</div>
        <button class="history-toggle">${order.detailsExpanded ? "Свернуть" : "Развернуть"}</button>
      </div>
      ${detailsHtml}
    </div>

    <div class="history">
      <div class="history-head"><div class="history-title">История</div></div>
      <div class="timeline">${timelineHtml}</div>
    </div>

    <div class="order-actions">${actionsHtml}</div>
  `;
  return card;
}

function toggleDetails(orderId) {
  const order = Store.getOrderById(orderId);
  order.detailsExpanded = !order.detailsExpanded;
  renderOrders();
}

function toggleStatusTip(event, statusKey) {
  event.stopPropagation();
  const wrap = event.currentTarget;
  const already = wrap.querySelector(".status-tip");
  closeStatusTip();
  if (already) return;
  const tip = document.createElement("div");
  tip.className = "status-tip";
  tip.textContent = STATUS_TIPS[statusKey] || "";
  wrap.appendChild(tip);
}
function closeStatusTip() {
  document.querySelectorAll(".status-tip").forEach(t => t.remove());
}
document.addEventListener("click", closeStatusTip);

let pendingAction = null;

function doAction(orderId, fromStatus, actionIdx) {
  const order = Store.getOrderById(orderId);
  const actions = getAvailableActions(order, fromStatus);
  const action = actions[actionIdx];
  if (!action) return;

  pendingAction = { order, action, assigneeId: order.assignee, comment: "" };

  if (action.assignTo) {
    openAssigneeModal();
  } else if (action.comment) {
    openCommentModal();
  } else {
    applyPendingAction();
  }
}

function applyPendingAction() {
  const { order, action, assigneeId, comment } = pendingAction;
  const role = getCurrentRole();

  let note = "";
  if (action.assignTo) note += ` — ${staffName(assigneeId)}`;
  if (action.comment && comment) note += `: ${comment}`;

  order.status = action.to;
  order.hasProblem = !!action.problem;
  order.assignee = assigneeId;
  // ?? role — иначе у заказа без исполнителя acceptedBy тоже стал бы null,
  // неотличимо от "не принято", и кнопка не блокировалась бы
  order.acceptedBy = action.accept ? (assigneeId ?? role) : null;

  const baseText = action.historyText || HISTORY_TEXT[action.to] || action.label;
  order.history.push({
    text: baseText + note,
    who: roleNames[role] || role,
    when: nowLabel(),
  });

  Store.saveOrder(order);
  pendingAction = null;
  closeModal();
  renderOrders();
}

function openModal(html) {
  document.getElementById("modalBox").innerHTML = html;
  document.getElementById("modalOverlay").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  document.getElementById("modalBox").innerHTML = "";
  pendingAction = null;
}
function closeModalOnOverlay(event) {
  if (event.target.id === "modalOverlay") closeModal();
}

function openAssigneeModal() {
  const people = staffByRole(pendingAction.action.assignTo);
  const currentAssignee = pendingAction.order.assignee;
  const optionsHtml = people.map(p =>
    `<option value="${p.id}" ${p.id === currentAssignee ? "selected" : ""}>${esc(p.name)}</option>`
  ).join("");

  openModal(`
    <div class="modal-header"><h3>Кому передать?</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Исполнитель</label>
        <select id="modalAssigneeSelect">${optionsHtml}</select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitAssignee()">Далее</button>
    </div>
  `);
}

function submitAssignee() {
  const select = document.getElementById("modalAssigneeSelect");
  pendingAction.assigneeId = Number(select.value);
  if (pendingAction.action.comment) {
    openCommentModal();
  } else {
    applyPendingAction();
  }
}

function openCommentModal() {
  // тот же механизм комментария, для action.problem — другой текст вопроса
  const isProblem = !!pendingAction.action.problem;
  const label = isProblem ? "Опишите проблему" : "Что поправить?";
  const placeholder = isProblem ? "Что пошло не так?" : "Опишите, что нужно исправить";

  openModal(`
    <div class="modal-header"><h3>${esc(pendingAction.action.label)}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">${label}</label>
        <textarea id="modalComment" rows="4" placeholder="${placeholder}"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitComment()">Отправить</button>
    </div>
  `);
}

function submitComment() {
  pendingAction.comment = document.getElementById("modalComment").value.trim();
  applyPendingAction();
}

document.getElementById("roleSelect").addEventListener("change", renderOrders);
renderOrders();
