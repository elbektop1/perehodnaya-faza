let questionFilterMine = false;

function visibleQuestions() {
  const all = Store.getQuestions();
  if (!questionFilterMine) return all;
  const me = getCurrentStaffId();
  return all.filter(q => q.addresseeId === me);
}

function nextQuestionStatusLabel(currentKey) {
  const statuses = Store.getQuestionStatuses();
  const i = statuses.findIndex(s => s.key === currentKey);
  const next = statuses[i + 1];
  return next ? next.label : "Закрыт";
}

function advanceQuestion(id) {
  const q = Store.getQuestions().find(x => x.id === id);
  if (!q) return;
  const statuses = Store.getQuestionStatuses();
  const i = statuses.findIndex(s => s.key === q.status);
  q.status = q.status === "closed" ? "open" : (statuses[i + 1] || statuses[i]).key;
  renderAllQuestions();
  if (typeof renderClientQuestions === "function") renderClientQuestions();
}

function questionOrderLabel(q) {
  if (!q.orderId) return "";
  const o = Store.getOrderById(q.orderId);
  return o ? `<span>Заказ ${esc(o.id)}</span>` : "";
}

function renderAllQuestions() {
  const items = visibleQuestions();
  const me = getCurrentStaffId();
  const card = q => {
    const isMine = q.addresseeId === me && q.status !== "closed";
    const actionBtn = isMine
      ? `<button class="small-btn" data-question-advance="${q.id}">${q.status === "closed" ? "Открыть снова" : "Ответить · " + nextQuestionStatusLabel(q.status)}</button>`
      : "";
    return `<div class="question-card">
      <strong>${esc(q.id)} · ${esc(q.title)}</strong>
      <p>${esc(q.text)}</p>
      <div class="question-meta">
        <span>${esc(clientCompany(q.clientId))}</span>
        ${questionOrderLabel(q)}
        <span>${esc(q.stage)}</span>
        <span>${esc(questionStatusLabel(q.status))}</span>
        <span>От: ${esc(staffName(q.authorId))}</span>
        <span>Кому: ${esc(staffName(q.addresseeId))}</span>
      </div>
      <div class="question-actions">
        ${actionBtn}
        <button class="small-btn" data-go="clients">К клиенту</button>
        <button class="small-btn" data-go="orders">К заказу</button>
      </div>
    </div>`;
  };
  const list = document.getElementById("questionList");
  if (list) list.innerHTML = items.map(card).join("") || '<div class="empty-state">Вопросов пока нет.</div>';
  const count = document.getElementById("questionCount");
  if (count) count.textContent = items.length;
  const countBadge = document.getElementById("questionCountBadge");
  if (countBadge) countBadge.textContent = Store.getQuestions().filter(q => q.status !== "closed").length;

  list?.querySelectorAll("[data-question-advance]").forEach(btn =>
    btn.addEventListener("click", () => advanceQuestion(btn.dataset.questionAdvance))
  );

  renderWorkspaceQuestions();
}

function renderWorkspaceQuestions() {
  const box = document.getElementById("workspaceMyQuestions");
  const badge = document.getElementById("workspaceQuestionBadge");
  if (!box && !badge) return;
  const me = getCurrentStaffId();
  const mine = Store.getQuestions().filter(q => q.addresseeId === me && q.status !== "closed");
  if (box) {
    box.innerHTML = mine.map(q =>
      `<div><strong>${esc(q.title)}</strong><span>${esc(clientCompany(q.clientId))} · от ${esc(staffName(q.authorId))} · ${esc(questionStatusLabel(q.status))}</span></div>`
    ).join("") || '<div class="empty-state">Вопросов к вам пока нет.</div>';
  }
  if (badge) badge.textContent = mine.length;
}

function populateQuestionForm() {
  const addresseeSel = document.getElementById("qAddressee");
  const orderSel = document.getElementById("qOrderLink");
  if (addresseeSel) {
    addresseeSel.innerHTML = Store.getStaff().map(p => `<option value="${p.id}">${esc(formatPersonName(p))}</option>`).join("");
  }
  if (orderSel) {
    orderSel.innerHTML = `<option value="">Без заказа</option>` +
      Store.getOrders().map(o => `<option value="${o.id}">Заказ · ${esc(o.id)} ${esc(o.title)}</option>`).join("");
  }
}

function submitQuestion() {
  const title = document.getElementById("qTitle").value.trim() || "Новый вопрос";
  const text = document.getElementById("qText").value.trim() || "Описание вопроса";
  const stage = document.getElementById("qStage").value;
  const addresseeId = Number(document.getElementById("qAddressee").value) || null;
  const orderId = document.getElementById("qOrderLink").value || null;
  const to = [...document.querySelectorAll(".recipient-grid input:checked")].map(x => x.value);

  const order = orderId ? Store.getOrderById(orderId) : null;
  const clientId = order ? Store.getClients().find(c => c.company === order.customer)?.id || null : null;

  const question = Store.addQuestion({
    title, text, stage, to, orderId, clientId,
    authorId: getCurrentStaffId(), addresseeId, status: "open",
  });

  if (typeof notifyNewQuestion === "function") notifyNewQuestion(question);

  if (clientId) {
    Store.addHistory({
      clientId, type: "Вопрос", author: staffName(getCurrentStaffId()) || "—",
      role: roleNames[getCurrentRole()], date: nowStamp(), text: `Создан вопрос ${question.id}: ${title} — адресат ${staffName(addresseeId)}.`,
    });
    if (typeof renderClientHistory === "function") renderClientHistory();
    if (typeof renderClientQuestions === "function") renderClientQuestions();
  }

  document.getElementById("qTitle").value = "";
  document.getElementById("qText").value = "";
  renderAllQuestions();
  navTo("questions");
}

function bindQuestionsPage() {
  document.getElementById("createQuestionBtn")?.addEventListener("click", submitQuestion);
  document.querySelectorAll("[data-question-filter]").forEach(btn => btn.addEventListener("click", () => {
    questionFilterMine = btn.dataset.questionFilter === "mine";
    document.querySelectorAll("[data-question-filter]").forEach(b => b.classList.toggle("active", b === btn));
    renderAllQuestions();
  }));
}

populateQuestionForm();
bindQuestionsPage();
renderAllQuestions();
