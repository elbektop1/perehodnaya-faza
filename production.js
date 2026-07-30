let productionMachineFilter = "all";
let planSortableInstance = null;

function planOrders() {
  return Store.getOrders()
    .filter(o => ["approval", "production"].includes(o.status))
    .sort((a, b) => a.priority - b.priority);
}

// fullPlan уже отсортирован по текущему priority. orderedSubsetIds — новый порядок
// подмножества (могло быть отфильтровано по станку): проходим по fullPlan и в местах,
// принадлежащих подмножеству, подставляем id по новому порядку — остальные заказы
// остаются на своих местах. В конце всему списку присваиваются свежие 0..N-1 —
// так приоритеты остаются различными, даже если у заказов изначально было одно
// и то же значение (в сид-данных у всех priority: 0)
function reassignPriorities(fullPlan, orderedSubsetIds) {
  const subset = new Set(orderedSubsetIds);
  let cursor = 0;
  const mergedIds = fullPlan.map(o => subset.has(o.id) ? orderedSubsetIds[cursor++] : o.id);
  return mergedIds.map((id, priority) => ({ id, priority }));
}

function machineLoad() {
  const plan = planOrders();
  return Store.getMachines()
    .filter(m => m !== "Не назначена")
    .map(m => ({
      machine: m,
      count: plan.filter(o => o.machine === m).length,
      runLength: plan.filter(o => o.machine === m).reduce((s, o) => s + (o.runLength || 0), 0),
    }));
}

function currentPlanList() {
  const plan = planOrders();
  return productionMachineFilter === "all" ? plan : plan.filter(o => o.machine === productionMachineFilter);
}

function applyReorder(orderedSubsetIds) {
  const updates = reassignPriorities(planOrders(), orderedSubsetIds);
  const role = getCurrentRole();
  updates.forEach(({ id, priority }) => {
    const order = Store.getOrderById(id);
    if (!order || order.priority === priority) return;
    order.priority = priority;
    order.history.push({ text: "Изменён приоритет в плане", who: roleNames[role] || role, when: nowLabel() });
    Store.saveOrder(order);
  });
  renderProduction();
}

function moveInPlan(orderId, direction) {
  const ids = currentPlanList().map(o => o.id);
  const i = ids.indexOf(orderId);
  const j = i + direction;
  if (i === -1 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  applyReorder(ids);
}

function initPlanSortable() {
  destroyPlanSortable();
  const el = document.getElementById("productionPlanList");
  if (!el || typeof Sortable === "undefined") return;
  planSortableInstance = Sortable.create(el, {
    handle: ".plan-drag-handle",
    animation: 150,
    onEnd: () => applyReorder([...el.children].map(c => c.dataset.orderId)),
  });
}
function destroyPlanSortable() {
  if (planSortableInstance) { planSortableInstance.destroy(); planSortableInstance = null; }
}

function planRowBadges(order) {
  let html = "";
  if (order.urgent) html += `<span class="badge-urgent">Срочно</span>`;
  if (order.hasProblem) html += `<span class="badge-problem">Проблема</span>`;
  if (order.needNewKnife) html += `<span class="badge-knife">Ожидает нож</span>`;
  return html;
}

function planRowHtml(order, index, total, canEdit) {
  const status = getStatus(order.status);
  const sortableReady = typeof Sortable !== "undefined";
  const handle = (canEdit && sortableReady) ? `<span class="plan-drag-handle" title="Перетащить">⠿</span>` : "";
  const controls = canEdit ? `
    <div class="plan-controls">
      <button class="btn btn-ghost btn-sm" ${index === 0 ? "disabled" : ""} onclick="moveInPlan('${order.id}', -1)">Выше</button>
      <button class="btn btn-ghost btn-sm" ${index === total - 1 ? "disabled" : ""} onclick="moveInPlan('${order.id}', 1)">Ниже</button>
    </div>` : "";

  return `
    <div class="plan-row" data-order-id="${order.id}">
      ${handle}
      <div class="plan-pos">${index + 1}</div>
      <div class="plan-info">
        <div class="plan-title">${esc(order.title)}</div>
        <div class="plan-meta">
          ${esc(order.customer)} · ${(order.runLength || 0).toLocaleString()} шт. · ${esc(order.machine || "—")} ·
          <span class="badge ${status.key}">${status.label}</span>
          ${planRowBadges(order)}
        </div>
      </div>
      <div class="plan-date">${order.shipDate ? renderShipDate(order.shipDate) : "Отгрузка не задана"}</div>
      ${controls}
    </div>
  `;
}

function renderMachineLoad() {
  const el = document.getElementById("productionMachineLoad");
  if (!el) return;
  const rows = machineLoad().map(m =>
    `<tr><td>${esc(m.machine)}</td><td>${m.count}</td><td>${m.runLength.toLocaleString()} шт.</td></tr>`
  ).join("");
  el.innerHTML = `
    <table class="report-table">
      <thead><tr><th>Станок</th><th>Заказов в очереди</th><th>Суммарный тираж</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderMachineFilters(show) {
  const el = document.getElementById("productionMachineFilters");
  if (!el) return;
  if (!show) { el.innerHTML = ""; return; }
  const machines = Store.getMachines().filter(m => m !== "Не назначена");
  const chips = [{ key: "all", label: "Все" }, ...machines.map(m => ({ key: m, label: m }))];
  el.innerHTML = chips.map(c =>
    `<button data-machine="${esc(c.key)}" class="${c.key === productionMachineFilter ? "active" : ""}">${esc(c.label)}</button>`
  ).join("");
  el.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    productionMachineFilter = btn.dataset.machine;
    renderProduction();
  }));
}

function renderPlanList(canEdit) {
  const el = document.getElementById("productionPlanList");
  if (!el) return;
  destroyPlanSortable();
  const list = currentPlanList();
  if (list.length === 0) {
    el.innerHTML = `<p class="muted">Нет заказов в очереди на согласование/печать</p>`;
    return;
  }
  el.innerHTML = list.map((o, i) => planRowHtml(o, i, list.length, canEdit)).join("");
  if (canEdit) initPlanSortable();
}

function queueOrders() {
  const staffId = getCurrentStaffId();
  return planOrders().filter(o => o.status === "production" && o.assignee === staffId);
}

function queueRowActionsHtml(order) {
  const actions = getAvailableActions(order, order.status);
  if (actions.length === 0) return `<span class="muted">Нет доступных действий</span>`;
  return actions.map((a, i) => {
    const cls = a.primary ? (a.variant === "ok" ? "btn btn-ok" : "btn btn-primary") : "btn btn-ghost";
    const disabledAttr = (a.accept && order.acceptedBy != null) ? " disabled" : "";
    return `<button class="${cls}"${disabledAttr} onclick="doAction('${order.id}', '${order.status}', ${i})">${a.label}</button>`;
  }).join("");
}

function queueCuttingLabel(order) {
  return {
    knife: order.knifeId ? `Нож ${Store.getKnives().find(k => k.id === order.knifeId)?.name || ""}` : "Нож",
    laser: "Лазер",
    new_knife: "Новый нож (+3 дн.)",
  }[order.cuttingType || "knife"] || "";
}

function queueRowHtml(order) {
  const status = getStatus(order.status);
  return `
    <div class="plan-row">
      <div class="plan-info">
        <div class="plan-title">${esc(order.title)}</div>
        <div class="plan-meta">
          ${esc(order.customer)} · ${(order.runLength || 0).toLocaleString()} шт. · ${esc(order.machine || "—")} ·
          Размер: ${esc(order.labelSize || "—")} · Высечка: ${queueCuttingLabel(order)} ·
          <span class="badge ${status.key}">${status.label}</span>
          ${planRowBadges(order)}
        </div>
      </div>
      <div class="plan-date">${order.shipDate ? renderShipDate(order.shipDate) : "Отгрузка не задана"}</div>
      <div class="order-actions">${queueRowActionsHtml(order)}</div>
    </div>
  `;
}

function renderQueueList() {
  const el = document.getElementById("productionQueueList");
  if (!el) return;
  const staffId = getCurrentStaffId();
  if (!staffId) {
    el.innerHTML = `<p class="muted">Выберите себя в «Вы», чтобы увидеть свою очередь печати.</p>`;
    return;
  }
  const list = queueOrders();
  el.innerHTML = list.length
    ? list.map(queueRowHtml).join("")
    : `<p class="muted">Нет заказов в очереди на печать</p>`;
}

function renderProduction() {
  const loadCard = document.getElementById("productionLoadCard");
  const planCard = document.getElementById("productionPlanCard");
  const queueCard = document.getElementById("productionQueueCard");
  if (!loadCard || !planCard || !queueCard) return;

  const role = getCurrentRole();
  const canEdit = role === "production_manager";
  const isWorker = role === "worker";
  if (!canEdit) productionMachineFilter = "all";

  loadCard.style.display = canEdit ? "" : "none";
  queueCard.style.display = isWorker ? "" : "none";

  const title = document.getElementById("productionPlanTitle");
  if (title) title.textContent = canEdit ? "Производственный план" : "Производственный план (просмотр)";

  if (canEdit) renderMachineLoad();
  renderMachineFilters(canEdit);
  renderPlanList(canEdit);
  if (isWorker) renderQueueList();
}

// doAction (orders.js) меняет статус заказа из очереди печати — перерендер плана/очереди
const _renderOrdersForProduction = renderOrders;
renderOrders = function () {
  _renderOrdersForProduction();
  renderProduction();
};

const _navToForProduction = navTo;
navTo = function (id) {
  _navToForProduction(id);
  if (id === "production") renderProduction();
};

renderProduction();
