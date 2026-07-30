const FINANCE_ROLES = ["director", "accountant", "economist", "manager"];

let financePeriod = "all";

function financeCanAct() {
  return FINANCE_ROLES.includes(getCurrentRole());
}

// today — YYYY-MM-DD; порядок проверок: оплачен → частично → активная отсрочка → просрочен → ожидает
function paymentStatus(order, today) {
  if (order.paid) return { key: "paid", label: "Оплачен" };
  if ((order.paidAmount || 0) > 0) return { key: "partial", label: "Частично" };
  if (order.deferral && order.deferral.until >= today) return { key: "deferred", label: `Отсрочка до ${formatShortDate(order.deferral.until)}` };
  const overdue = (order.paymentDue && order.paymentDue < today) || (order.deferral && order.deferral.until < today);
  if (overdue) return { key: "overdue", label: "Просрочен" };
  return { key: "pending", label: "Ожидает оплату" };
}

function renderFinance() {
  const kpiGrid = document.getElementById("financeKpiGrid");
  const paymentsEl = document.getElementById("financePayments");
  const receivablesEl = document.getElementById("financeReceivables");
  if (!kpiGrid || !paymentsEl || !receivablesEl) return;

  const role = getCurrentRole();
  if (!FINANCE_ROLES.includes(role)) {
    kpiGrid.innerHTML = "";
    paymentsEl.innerHTML = "";
    receivablesEl.innerHTML = "";
    const summaryEl = document.getElementById("financeReceivablesSummary");
    if (summaryEl) summaryEl.innerHTML = "";
    return;
  }
  renderFinanceKpis(role);
  renderFinancePayments();
  renderFinanceReceivables(role);
}

function renderFinanceKpis(role) {
  const grid = document.getElementById("financeKpiGrid");
  const s = Store.getFinanceSummary(financePeriod);
  const showCost = role !== "manager";
  const margin = s.revenue > 0 ? Math.round((s.profit / s.revenue) * 100) : 0;

  const cards = [
    `<article class="crm-kpi"><span>Выручка</span><strong>${formatMoney(s.revenue)}</strong><small>${s.ordersCount} заказ(ов) за период</small></article>`,
  ];
  if (showCost) {
    cards.push(`<article class="crm-kpi"><span>Себестоимость</span><strong>${formatMoney(s.cost)}</strong><small>по учтённым заказам</small></article>`);
    cards.push(`<article class="crm-kpi${s.profit < 0 ? " urgent" : ""}"><span>Прибыль</span><strong>${formatMoney(s.profit)}</strong><small>маржа ${margin}%</small></article>`);
  }
  cards.push(`<article class="crm-kpi${s.debt > 0 ? " urgent" : ""}"><span>Долг</span><strong>${formatMoney(s.debt)}</strong><small>оплачено ${formatMoney(s.paid)}</small></article>`);
  grid.innerHTML = cards.join("");
}

function bindFinancePeriodFilters() {
  document.querySelectorAll("#financePeriodFilters button").forEach(btn => {
    btn.addEventListener("click", () => {
      financePeriod = btn.dataset.period;
      document.querySelectorAll("#financePeriodFilters button").forEach(b => b.classList.toggle("active", b === btn));
      renderFinance();
    });
  });
}

function renderFinancePayments() {
  const el = document.getElementById("financePayments");
  const today = todayIso();
  const items = Store.getOrders()
    .filter(o => o.clientPrice != null)
    .sort((a, b) => (a.shipDate || "").localeCompare(b.shipDate || ""));

  const head = `<div class="head"><span>№ заказа</span><span>Клиент</span><span>Сумма</span><span>Оплачено</span><span>Остаток</span><span>Статус</span><span>Срок</span><span>Действия</span></div>`;
  const rows = items.map(o => {
    const st = paymentStatus(o, today);
    const remain = Math.max(o.clientPrice - o.paidAmount, 0);
    const termLabel = o.deferral ? formatShortDate(o.deferral.until) : (o.paymentDue ? formatDate(o.paymentDue) : "—");
    const canAct = financeCanAct();
    const actions = canAct
      ? `<button class="small-btn" onclick="openPaymentModal('${o.id}')">Оплата</button>
         ${o.deferral
           ? `<button class="small-btn" onclick="openClearDeferralModal('${o.id}')">Снять отсрочку</button>`
           : `<button class="small-btn" onclick="openDeferralModal('${o.id}')">Отсрочка</button>`}`
      : "—";
    return `<div>
      <span>#${esc(o.id)}</span>
      <span>${esc(o.customer)}</span>
      <span>${formatMoney(o.clientPrice)}</span>
      <span>${formatMoney(o.paidAmount)}</span>
      <span>${formatMoney(remain)}</span>
      <span><span class="pay-status pay-status-${st.key}">${esc(st.label)}</span></span>
      <span>${termLabel}</span>
      <span class="pay-actions">${actions}</span>
    </div>`;
  }).join("");

  el.innerHTML = head + (rows || `<div class="empty-state">Пока нет заказов с указанной ценой.</div>`);
}

function renderFinanceReceivables(role) {
  const el = document.getElementById("financeReceivables");
  const summaryEl = document.getElementById("financeReceivablesSummary");
  const today = todayIso();
  const items = Store.getReceivables();

  el.innerHTML = items.map(o => {
    const remain = o.clientPrice - o.paidAmount;
    const st = paymentStatus(o, today);
    return `<article>
      <strong>#${esc(o.id)} · ${esc(o.customer)}</strong>
      <span>Остаток ${formatMoney(remain)} · ${esc(st.label)}</span>
      ${financeCanAct() ? `<button class="small-btn" onclick="openPaymentModal('${o.id}')">Внести оплату</button>` : ""}
    </article>`;
  }).join("") || `<div class="empty-state">Задолженностей нет.</div>`;

  if (!summaryEl) return;
  if (role === "director" && items.length) {
    const totalDebt = items.reduce((s, o) => s + (o.clientPrice - o.paidAmount), 0);
    const byClient = {};
    items.forEach(o => { byClient[o.customer] = (byClient[o.customer] || 0) + (o.clientPrice - o.paidAmount); });
    const rows = Object.entries(byClient).sort((a, b) => b[1] - a[1])
      .map(([name, sum]) => `<div><strong>${esc(name)}</strong><span>${formatMoney(sum)}</span></div>`).join("");
    summaryEl.innerHTML = `<div class="mini-table"><div><strong>Итого долг по компании</strong><span>${formatMoney(totalDebt)}</span></div>${rows}</div>`;
  } else {
    summaryEl.innerHTML = "";
  }
}

/* ---------- модалки действий ---------- */

function financeHistoryNote(text) {
  return { text, who: roleNames[getCurrentRole()] || getCurrentRole(), when: nowLabel() };
}

function refreshAfterFinanceAction() {
  renderFinance();
  if (typeof renderOrders === "function") renderOrders();
  if (typeof renderClientOrders === "function") renderClientOrders();
}

function openPaymentModal(orderId) {
  if (!financeCanAct()) return;
  const order = Store.getOrderById(orderId);
  if (!order) return;
  const remain = Math.max((order.clientPrice || 0) - order.paidAmount, 0);
  const paymentsHtml = order.payments.length
    ? order.payments.map(p => `<div class="pay-history-row">
        <span>${formatMoney(p.amount)} · ${esc(p.method)} · ${formatDate(p.date)}${p.note ? " · " + esc(p.note) : ""}</span>
        <button class="link-like" onclick="removePaymentAndRefresh('${order.id}','${p.id}')">Откатить</button>
      </div>`).join("")
    : `<p class="muted">Платежей ещё не было.</p>`;

  openModal(`
    <div class="modal-header"><h3>Оплата заказа #${esc(order.id)}</h3></div>
    <div class="modal-body">
      <p class="muted">Цена: ${formatMoney(order.clientPrice)} · Оплачено: ${formatMoney(order.paidAmount)} · Остаток: ${formatMoney(remain)}</p>
      <div class="field"><label class="field-label">Сумма платежа</label><input id="paymentAmountInput" type="number" min="1" step="1" placeholder="Например, 20000" /></div>
      <div class="field"><label class="field-label">Дата</label><input id="paymentDateInput" type="date" value="${todayIso()}" /></div>
      <div class="field"><label class="field-label">Способ</label>
        <select id="paymentMethodInput"><option value="безнал">Безнал</option><option value="нал">Наличные</option><option value="карта">Карта</option></select>
      </div>
      <div class="field"><label class="field-label">Комментарий</label><input id="paymentNoteInput" placeholder="Необязательно" /></div>
      <div class="pay-history">${paymentsHtml}</div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitPayment('${order.id}')">Внести оплату</button>
    </div>
  `);
}

function submitPayment(orderId) {
  const order = Store.getOrderById(orderId);
  const amount = Math.round(Number(document.getElementById("paymentAmountInput").value));
  if (!order || !amount || amount <= 0) return;
  const date = document.getElementById("paymentDateInput").value || todayIso();
  const method = document.getElementById("paymentMethodInput").value;
  const note = document.getElementById("paymentNoteInput").value.trim();
  const who = getCurrentStaffId();

  Store.addPayment(order.id, { amount, date, method, who, note });
  order.history.push(financeHistoryNote(`Внесена оплата ${formatMoney(amount)} (${method}${note ? ", " + note : ""})`));
  closeModal();
  refreshAfterFinanceAction();
}

function removePaymentAndRefresh(orderId, paymentId) {
  const order = Store.getOrderById(orderId);
  const removed = Store.removePayment(orderId, paymentId);
  if (!order || !removed) return;
  order.history.push(financeHistoryNote(`Откачен платёж ${formatMoney(removed.amount)} от ${formatDate(removed.date)}`));
  openPaymentModal(orderId);
  refreshAfterFinanceAction();
}

function openDeferralModal(orderId) {
  if (!financeCanAct()) return;
  const order = Store.getOrderById(orderId);
  if (!order) return;
  openModal(`
    <div class="modal-header"><h3>Отсрочка по заказу #${esc(order.id)}</h3></div>
    <div class="modal-body">
      <div class="field"><label class="field-label">Отсрочка до</label><input id="deferUntilInput" type="date" value="${order.deferral?.until || ""}" /></div>
      <div class="field"><label class="field-label">Сумма</label><input id="deferAmountInput" type="number" min="1" step="1" value="${order.clientPrice || ""}" /></div>
      <div class="field"><label class="field-label">Причина</label><textarea id="deferReasonInput" rows="3" placeholder="Например, постоянный клиент">${esc(order.deferral?.reason || "")}</textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitDeferral('${order.id}')">Оформить отсрочку</button>
    </div>
  `);
}

function submitDeferral(orderId) {
  const order = Store.getOrderById(orderId);
  const until = document.getElementById("deferUntilInput").value;
  if (!order || !until) return;
  const amount = Math.round(Number(document.getElementById("deferAmountInput").value)) || order.clientPrice || 0;
  const reason = document.getElementById("deferReasonInput").value.trim();

  Store.setDeferral(order.id, { approvedBy: getCurrentStaffId(), until, amount, reason, createdAt: todayIso() });
  order.history.push(financeHistoryNote(`Оформлена отсрочка до ${formatShortDate(until)}${reason ? ": " + reason : ""}`));
  closeModal();
  refreshAfterFinanceAction();
}

function openClearDeferralModal(orderId) {
  if (!financeCanAct()) return;
  const order = Store.getOrderById(orderId);
  if (!order || !order.deferral) return;
  openModal(`
    <div class="modal-header"><h3>Снять отсрочку по заказу #${esc(order.id)}</h3></div>
    <div class="modal-body"><p>Отсрочка до ${formatShortDate(order.deferral.until)} будет снята. Продолжить?</p></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitClearDeferral('${order.id}')">Снять</button>
    </div>
  `);
}

function submitClearDeferral(orderId) {
  const order = Store.getOrderById(orderId);
  if (!order) return;
  Store.clearDeferral(order.id);
  order.history.push(financeHistoryNote("Отсрочка снята"));
  closeModal();
  refreshAfterFinanceAction();
}

// вызывается из orders.js: doAction() блокирует ready→done, если canShip() вернул false
function openShipBlockedModal(order) {
  const canAct = financeCanAct();
  const actionsHtml = canAct
    ? `<button class="btn btn-primary" onclick="closeModal(); openPaymentModal('${order.id}')">Внести оплату</button>
       <button class="btn btn-ghost" onclick="closeModal(); openDeferralModal('${order.id}')">Оформить отсрочку</button>`
    : `<button class="btn btn-ghost" onclick="closeModal()">Понятно</button>`;
  const explain = canAct
    ? "Заказ не оплачен и нет действующей отсрочки."
    : "Заказ не оплачен и нет действующей отсрочки. Обратитесь к бухгалтеру или директору.";

  openModal(`
    <div class="modal-header"><h3>Нельзя отгрузить</h3></div>
    <div class="modal-body"><p>${explain}</p></div>
    <div class="modal-footer">${actionsHtml}</div>
  `);
}

bindFinancePeriodFilters();
renderFinance();

// navTo объявлена в shell.js (и уже обёрнута в orders.js) — довешиваем обновление раздела «Финансы»
const _navToFinance = navTo;
navTo = function (id) {
  _navToFinance(id);
  if (id === "finance") renderFinance();
};
