let currentClientId = null;

function parseDateStr(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDate(s) {
  const d = parseDateStr(s);
  return d ? d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
}
function isOverdue(client) {
  const d = parseDateStr(client.nextActionDate);
  if (!d) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return d < today;
}
function hasNoNextStep(client) {
  return !client.nextAction || !client.nextActionDate;
}
function nowStamp() {
  return new Date().toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", " ·");
}
function managerName(id) {
  const p = Store.getStaff().find(s => s.id === id);
  return p ? p.name : "—";
}
function currentRoleLabel() {
  return roleNames[document.getElementById("roleSelect").value] || "";
}
function currentClient() {
  return currentClientId ? Store.getClientById(currentClientId) : null;
}
function clientCompany(clientId) {
  const c = clientId && Store.getClientById(clientId);
  return c ? c.company : "Без привязки к клиенту";
}

/* ---------- список и карточка клиента ---------- */

function visibleClients() {
  const q = (document.getElementById("clientSearchInput")?.value || "").trim().toLowerCase();
  const all = Store.getClients();
  if (!q) return all;
  return all.filter(c =>
    c.company.toLowerCase().includes(q) ||
    (c.inn || "").includes(q) ||
    (c.city || "").toLowerCase().includes(q)
  );
}

function renderClientList() {
  const list = document.getElementById("clientListItems");
  if (!list) return;
  const items = visibleClients();
  if (!currentClientId && items.length) currentClientId = items[0].id;
  list.innerHTML = items.map(c => {
    let flag = "";
    if (isOverdue(c)) flag = ' <span class="badge-urgent">Просрочено</span>';
    else if (hasNoNextStep(c)) flag = ' <span class="badge-problem">Без шага</span>';
    return `<button class="client-item ${c.id === currentClientId ? "active" : ""}" data-client-id="${c.id}">
      <strong>${esc(c.company)}</strong>
      <span>${esc(c.stage)}${flag}</span>
    </button>`;
  }).join("") || '<div class="empty-state">Клиенты не найдены.</div>';
  list.querySelectorAll("[data-client-id]").forEach(btn =>
    btn.addEventListener("click", () => selectClient(btn.dataset.clientId))
  );
}

function selectClient(id) {
  currentClientId = id;
  renderClientList();
  renderClientCard();
}

function renderClientCard() {
  const c = currentClient();
  if (!c) return;
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

  set("clientCardName", c.company);
  set("clientCardStageBadge", c.stage);
  set("clientInfoInn", c.inn || "—");
  set("clientInfoCity", c.city || "—");
  set("clientInfoSegment", c.segment || "—");
  set("clientInfoManager", managerName(c.manager));

  set("clientBoardStage", c.stage);
  set("clientBoardSource", c.source ? "Источник: " + c.source : "Источник не указан");
  set("clientBoardNextAction", c.nextAction || "Не назначено");
  set("clientBoardNextDate", c.nextActionDate ? formatDate(c.nextActionDate) : "—");
  set("clientBoardLastTouch", c.lastTouch ? formatDate(c.lastTouch) : "—");

  set("clientOverviewNextAction", c.nextAction || "Не назначено");
  set("clientOverviewNextDate", c.nextActionDate ? "Срок: " + formatDate(c.nextActionDate) : "Дата не назначена");
  set("clientOverviewLastTouch", c.lastTouch ? formatDate(c.lastTouch) : "—");
  set("clientOverviewSource", c.source || "—");
  set("clientOverviewSegment", c.segment || "—");
  set("clientOverviewComment", c.comment || "Без комментариев");

  renderClientHistory();
  renderClientOrders();
  renderClientTasks();
  renderClientQuestions();
  if (typeof renderClientFiles === "function") renderClientFiles();
}

function renderClientHistory() {
  const el = document.getElementById("clientTimeline");
  if (!el) return;
  const c = currentClient();
  const items = c ? Store.getHistory(c.id) : [];
  el.innerHTML = items.slice().reverse().map(item =>
    `<div class="timeline-item"><div class="meta"><span>${esc(item.date)}</span><span>·</span><span>${esc(item.author)}</span><span>·</span><span>${esc(item.role)}</span></div><strong>${esc(item.type)}</strong><div>${esc(item.text)}</div></div>`
  ).join("") || '<div class="empty-state">Пока нет записей.</div>';
}

function renderClientOrders() {
  const el = document.getElementById("clientOrdersList");
  if (!el) return;
  const c = currentClient();
  const items = c ? Store.getOrdersByClient(c.company) : [];
  el.innerHTML = items.map(o => {
    const paySummary = orderPaymentSummary(o);
    return `<div><strong>${esc(o.id)}</strong><span>${esc(o.title)} · ${esc(getStatus(o.status)?.label || o.status)}${paySummary ? " · Оплата: " + esc(paySummary) : ""}</span><button class="small-btn" data-go="orders">Открыть заказ</button></div>`;
  }).join("") || '<div class="empty-state">У клиента пока нет заказов.</div>';
}

function renderClientTasks() {
  const el = document.getElementById("clientTasksList");
  if (!el) return;
  const c = currentClient();
  const items = c ? Store.getTasks(c.id) : [];
  el.innerHTML = items.map(t =>
    `<div><strong>${esc(t.id)}</strong><span>${esc(t.title)} · срок ${formatDate(t.dueDate)} · ${t.status === "done" ? "выполнено" : "открыта"}</span><button class="small-btn" data-task-toggle="${t.id}">${t.status === "done" ? "Вернуть" : "Готово"}</button></div>`
  ).join("") || '<div class="empty-state">Задач по клиенту пока нет.</div>';
  el.querySelectorAll("[data-task-toggle]").forEach(btn =>
    btn.addEventListener("click", () => toggleClientTask(btn.dataset.taskToggle))
  );
}
function toggleClientTask(id) {
  const t = Store.getTasks().find(x => x.id === id);
  if (!t) return;
  t.status = t.status === "done" ? "open" : "done";
  renderClientTasks();
}

function questionStatusLabel(key) {
  return Store.getQuestionStatuses().find(s => s.key === key)?.label || key;
}

function renderClientQuestions() {
  const el = document.getElementById("clientQuestionHistory");
  const c = currentClient();
  const items = c ? Store.getQuestions(c.id) : [];
  if (el) {
    el.innerHTML = items.map(q =>
      `<div><strong>${esc(q.id)} · ${esc(q.title)}</strong><span>${esc(q.stage)} · ${esc(questionStatusLabel(q.status))} · адресат: ${esc(staffName(q.addresseeId))}</span><button class="small-btn" data-go="questions">Открыть вопрос</button></div>`
    ).join("") || '<div class="empty-state">Вопросов по клиенту пока нет.</div>';
  }
  const badge = document.getElementById("clientOpenQuestionsBadge");
  if (badge) badge.textContent = items.filter(q => q.status !== "closed").length;
}

/* ---------- глобальный список вопросов — вынесен в questions.js (Фаза 4) ---------- */

/* ---------- воронка, KPI, риск-лист ---------- */

function renderFunnel() {
  const board = document.getElementById("crmFunnelBoard");
  if (!board) return;
  const clients = Store.getClients();
  board.innerHTML = Store.getFunnelStages().map(stage => {
    const inStage = clients.filter(c => c.stage === stage);
    const deals = inStage.map(c =>
      `<div class="crm-deal ${isOverdue(c) ? "overdue" : ""}" data-client-id="${c.id}"><b>${esc(c.company)}</b><span>${esc(c.nextAction || "Следующий шаг не назначен")}</span></div>`
    ).join("");
    return `<div class="crm-lane"><h4>${esc(stage)} · ${inStage.length}</h4>${deals || '<p class="muted small-text">Пусто</p>'}</div>`;
  }).join("");
  board.querySelectorAll("[data-client-id]").forEach(el =>
    el.addEventListener("click", () => { selectClient(el.dataset.clientId); navTo("clients"); })
  );
}

function renderCrmKpis() {
  const clients = Store.getClients();
  const set = (id, n) => { const el = document.getElementById(id); if (el) el.textContent = n; };
  set("kpiOverdue", clients.filter(isOverdue).length);
  set("kpiNoNextStep", clients.filter(hasNoNextStep).length);
  set("kpiWaiting", clients.filter(c => c.stage === "Ждём ответ").length);
  set("kpiEstimating", clients.filter(c => c.stage === "На просчёте").length);
  set("kpiContract", clients.filter(c => c.stage === "Договор").length);
}

function renderRiskList() {
  const el = document.getElementById("crmRiskList");
  if (!el) return;
  const items = Store.getClients().filter(hasNoNextStep);
  el.innerHTML = items.map(c =>
    `<article><strong>${esc(c.company)}</strong><span>${esc(c.comment || "Не назначено следующее действие.")}</span><button class="small-btn" data-assign-client="${c.id}">Назначить</button></article>`
  ).join("") || '<div class="empty-state">У всех клиентов назначен следующий шаг.</div>';
  el.querySelectorAll("[data-assign-client]").forEach(btn =>
    btn.addEventListener("click", () => {
      const sel = document.getElementById("crmFormClient");
      if (sel) sel.value = btn.dataset.assignClient;
      document.getElementById("crmFormComment")?.focus();
    })
  );
}

function refreshCrmViews() {
  renderClientList();
  if (currentClientId) renderClientCard();
  renderFunnel();
  renderCrmKpis();
  renderRiskList();
}

/* ---------- вкладки карточки клиента ---------- */

function openClientTab(id) {
  navTo("clients");
  const tab = document.querySelector(`.client-tabs .tab[data-tab="${id}"]`);
  const panel = document.getElementById(id);
  if (!tab || !panel) return;
  document.querySelectorAll(".client-tabs .tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".client-card .tab-panel").forEach(p => p.classList.remove("active"));
  tab.classList.add("active");
  panel.classList.add("active");
}

/* ---------- действия ---------- */

function openAddClientModal() {
  const managers = Store.getStaff().filter(s => s.role === "manager");
  openModal(`
    <div class="modal-header"><h3>Новый клиент</h3></div>
    <div class="modal-body">
      <div class="field"><label class="field-label">Компания</label><input id="newClientCompany" placeholder="ООО «Компания»" /></div>
      <div class="field"><label class="field-label">ИНН</label><input id="newClientInn" /></div>
      <div class="field"><label class="field-label">Город</label><input id="newClientCity" /></div>
      <div class="field"><label class="field-label">Сегмент</label><input id="newClientSegment" /></div>
      <div class="field"><label class="field-label">Источник</label><input id="newClientSource" placeholder="Сайт, рекомендация, холодный поиск..." /></div>
      <div class="field"><label class="field-label">Ответственный менеджер</label>
        <select id="newClientManager">${managers.map(m => `<option value="${m.id}">${esc(m.name)}</option>`).join("")}</select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitAddClient()">Создать</button>
    </div>
  `);
}
function submitAddClient() {
  const company = document.getElementById("newClientCompany").value.trim();
  if (!company) return;
  const client = Store.saveClient({
    company,
    inn: document.getElementById("newClientInn").value.trim(),
    city: document.getElementById("newClientCity").value.trim(),
    segment: document.getElementById("newClientSegment").value.trim(),
    source: document.getElementById("newClientSource").value.trim(),
    manager: Number(document.getElementById("newClientManager").value) || null,
    stage: "Новый лид",
    nextAction: "", nextActionDate: "", lastTouch: "", comment: "",
  });
  closeModal();
  currentClientId = client.id;
  populateCrmFormClientSelect();
  refreshCrmViews();
  navTo("clients");
}

function populateCrmFormClientSelect() {
  const sel = document.getElementById("crmFormClient");
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = Store.getClients().map(c => `<option value="${c.id}">${esc(c.company)}</option>`).join("");
  if (prev) sel.value = prev;
}

function bindClientsPage() {
  document.getElementById("clientSearchInput")?.addEventListener("input", renderClientList);
  document.getElementById("addClientBtn")?.addEventListener("click", openAddClientModal);

  document.getElementById("addHistoryBtn")?.addEventListener("click", () => {
    const c = currentClient();
    const input = document.getElementById("historyInput");
    const val = input.value.trim();
    if (!c || !val) return;
    Store.addHistory({ clientId: c.id, type: "Комментарий", author: staffName(getCurrentStaffId()) || "—", role: currentRoleLabel(), date: nowStamp(), text: val });
    input.value = "";
    renderClientHistory();
  });

  document.getElementById("addClientTaskBtn")?.addEventListener("click", () => {
    const c = currentClient();
    const titleEl = document.getElementById("clientTaskTitleInput");
    const dateEl = document.getElementById("clientTaskDateInput");
    const title = titleEl.value.trim();
    if (!c || !title) return;
    Store.addTask({ clientId: c.id, title, dueDate: dateEl.value, status: "open" });
    titleEl.value = ""; dateEl.value = "";
    renderClientTasks();
  });

  document.getElementById("addClientQuestionBtn")?.addEventListener("click", () => {
    const c = currentClient();
    const titleEl = document.getElementById("clientQuestionTitleInput");
    const title = titleEl.value.trim();
    if (!c || !title) return;
    Store.addQuestion({
      clientId: c.id, orderId: null, title, text: title, stage: "CRM", to: ["Менеджер"],
      authorId: getCurrentStaffId(), addresseeId: c.manager, status: "open",
    });
    Store.addHistory({ clientId: c.id, type: "Вопрос", author: staffName(getCurrentStaffId()) || "—", role: currentRoleLabel(), date: nowStamp(), text: "Создан вопрос: " + title });
    titleEl.value = "";
    renderClientQuestions();
    renderClientHistory();
    if (typeof renderAllQuestions === "function") renderAllQuestions();
  });

  document.getElementById("addClientOrderBtn")?.addEventListener("click", () => {
    const c = currentClient();
    const titleEl = document.getElementById("clientOrderTitleInput");
    const runEl = document.getElementById("clientOrderRunInput");
    const shipEl = document.getElementById("clientOrderShipInput");
    const title = titleEl.value.trim();
    if (!c || !title) return;
    const id = "AL" + String(Date.now()).slice(-6);
    Store.saveOrder({
      id, title, customer: c.company, status: "new", assignee: null,
      hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false,
      materials: [], files: [], customerEmail: "", priority: 0,
      knifeId: null, cuttingType: "knife", needNewKnife: false, createdBy: null, paymentDue: "",
      clientPrice: null, costPrice: null,
      runLength: Number(runEl.value) || 0, orderType: "new", labelSize: "",
      material: "", lamination: "Нет", machine: "",
      shipDate: shipEl.value || "", manager: currentRoleLabel() || "Менеджер",
      history: [{ text: "Заказ создан из карточки клиента", who: "менеджер", when: nowLabel() }],
    });
    Store.addHistory({ clientId: c.id, type: "Заказ", author: staffName(getCurrentStaffId()) || "—", role: currentRoleLabel(), date: nowStamp(), text: `Создан заказ ${id}: ${title}` });
    titleEl.value = ""; runEl.value = ""; shipEl.value = "";
    renderClientOrders();
    renderClientHistory();
    if (typeof renderOrders === "function") renderOrders();
  });

  document.getElementById("demoCrmReminderBtn")?.addEventListener("click", () => {
    const c = Store.getClientById(document.getElementById("crmFormClient").value);
    if (!c) return;
    const action = document.getElementById("crmFormAction").value;
    const date = document.getElementById("crmFormDate").value;
    const time = document.getElementById("crmFormTime").value;
    const comment = document.getElementById("crmFormComment").value.trim();
    c.nextAction = action;
    c.nextActionDate = date;
    c.lastTouch = new Date().toISOString().slice(0, 10);
    Store.addHistory({
      clientId: c.id, type: "Звонок/касание", author: staffName(getCurrentStaffId()) || "—", role: currentRoleLabel(),
      date: nowStamp(),
      text: `${action}${time ? " · " + time : ""}. ${comment || "Без комментария."} Следующее действие: ${action}${date ? " до " + formatDate(date) : ""}.`,
    });
    document.getElementById("crmFormComment").value = "";
    refreshCrmViews();
  });
}

/* «Рабочий день менеджера» — статичный демо-список (не рендерится из store),
   при большом числе пунктов показываем срочные сразу, остальное — под тумблером */
function setupCrmDailyStack() {
  const stack = document.querySelector(".crm-action-stack");
  if (!stack) return;
  const items = [...stack.children];
  if (items.length <= 3) return;

  const priority = el => (el.classList.contains("overdue") ? 0 : el.classList.contains("hot") ? 1 : 2);
  items.sort((a, b) => priority(a) - priority(b));
  items.forEach(el => stack.appendChild(el));

  const rest = items.slice(3);
  const more = document.createElement("div");
  more.className = "crm-action-stack-more";
  rest.forEach(el => more.appendChild(el));

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "small-btn crm-action-stack-toggle";
  toggle.textContent = `Показать все (${rest.length})`;
  toggle.addEventListener("click", () => {
    const open = more.classList.toggle("open");
    toggle.textContent = open ? "Свернуть" : `Показать все (${rest.length})`;
  });

  stack.appendChild(more);
  stack.appendChild(toggle);
}

bindClientsPage();
populateCrmFormClientSelect();
refreshCrmViews();
setupCrmDailyStack();
