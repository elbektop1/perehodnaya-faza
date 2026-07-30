const BLANK_CREATE_ROLES = ["manager", "assistant", "designer", "technologist"];
const BLANK_SEND_ROLES   = ["manager", "assistant"];
const BLANK_SIGN_ROLES   = ["manager", "assistant"]; // включает и отклонение

function blankStatusLabel(status) {
  return { draft: "Черновик", sent: "На согласовании", signed: "Подписан", rejected: "Отклонён" }[status] || status;
}

function blankStatusBadgeHtml(status) {
  const cls = { draft: "pending", sent: "deferred", signed: "paid", rejected: "overdue" }[status] || "pending";
  return `<span class="pay-status pay-status-${cls}">${blankStatusLabel(status)}</span>`;
}

function daysWaiting(order) {
  if (!order.blank || order.blank.status !== "sent" || !order.blank.sentAt) return null;
  const sent = parseShipDate(order.blank.sentAt);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((today - sent) / 86400000);
}

function blankHistoryNote(text) {
  return { text, who: roleNames[getCurrentRole()] || getCurrentRole(), when: nowLabel() };
}

function refreshAfterBlankAction() {
  renderApprovals();
  if (typeof renderOrders === "function") renderOrders();
  if (typeof renderClientOrders === "function") renderClientOrders();
  if (typeof renderProduction === "function") renderProduction();
}

// используется из orders.js (renderOrderCard) — доступна только после загрузки этого файла
function orderBlankLineHtml(order, role) {
  if (!order.blank) {
    return BLANK_CREATE_ROLES.includes(role)
      ? `<button class="btn btn-ghost btn-sm" onclick="openCreateBlankModal('${order.id}')">Создать бланк</button>`
      : `<span class="muted">не создан</span>`;
  }
  return `${blankStatusBadgeHtml(order.blank.status)} <span class="muted">в.${order.blank.version}</span>`;
}

// --- guard запуска в производство: блокирующая модалка (вызывается из orders.js/doAction) ---

function blankBlockedActionsHtml(order, role) {
  const status = order.blank ? order.blank.status : null;
  const buttons = [];
  if (!order.blank && BLANK_CREATE_ROLES.includes(role)) {
    buttons.push(`<button class="btn btn-primary" onclick="closeModal(); openCreateBlankModal('${order.id}')">Создать бланк</button>`);
  } else if (status === "draft" && BLANK_SEND_ROLES.includes(role)) {
    buttons.push(`<button class="btn btn-primary" onclick="closeModal(); openSendBlankModal('${order.id}')">Отправить на согласование</button>`);
  } else if (status === "sent" && BLANK_SIGN_ROLES.includes(role)) {
    buttons.push(`<button class="btn btn-primary" onclick="closeModal(); openSignBlankModal('${order.id}')">Отметить подписанным</button>`);
  } else if (status === "rejected" && BLANK_CREATE_ROLES.includes(role)) {
    buttons.push(`<button class="btn btn-primary" onclick="closeModal(); openReviseBlankModal('${order.id}')">Создать новую версию</button>`);
  }
  buttons.push(`<button class="btn btn-ghost" onclick="closeModal()">${buttons.length ? "Отмена" : "Понятно"}</button>`);
  return buttons.join("");
}

function openBlankBlockedModal(order) {
  const role = getCurrentRole();
  const status = order.blank ? order.blank.status : null;
  const reasonText = !order.blank
    ? "Бланк согласования ещё не создан."
    : status === "draft" ? "Бланк создан, но ещё не отправлен клиенту."
    : status === "sent" ? "Бланк отправлен клиенту, ответа пока нет."
    : `Клиент отклонил бланк: ${order.blank.note || "без указания причины"}.`;

  openModal(`
    <div class="modal-header"><h3>Нельзя запустить в производство</h3></div>
    <div class="modal-body"><p>${esc(reasonText)}</p></div>
    <div class="modal-footer">${blankBlockedActionsHtml(order, role)}</div>
  `);
}

// --- создание / отправка / подписание / отклонение ---

function openCreateBlankModal(orderId) {
  if (!BLANK_CREATE_ROLES.includes(getCurrentRole())) return;
  const order = Store.getOrderById(orderId);
  if (!order) return;
  openModal(`
    <div class="modal-header"><h3>Создать бланк согласования</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Файл бланка</label>
        <input id="blankFileInput" placeholder="например, blank_${order.id}_v1.jpg" />
      </div>
      <div class="field">
        <label class="field-label">Комментарий (необязательно)</label>
        <textarea id="blankNoteInput" rows="3" placeholder="Что нужно проверить клиенту"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitCreateBlank('${order.id}')">Создать</button>
    </div>
  `);
}

function submitCreateBlank(orderId) {
  const order = Store.getOrderById(orderId);
  if (!order) return;
  const fileName = document.getElementById("blankFileInput").value.trim();
  const note = document.getElementById("blankNoteInput").value.trim();
  const blank = Store.createBlank(orderId, { fileName, note });
  order.history.push(blankHistoryNote(`Создан бланк согласования ${blank.id} в.${blank.version}`));
  closeModal();
  refreshAfterBlankAction();
}

function openSendBlankModal(orderId) {
  if (!BLANK_SEND_ROLES.includes(getCurrentRole())) return;
  const order = Store.getOrderById(orderId);
  if (!order || !order.blank) return;
  openModal(`
    <div class="modal-header"><h3>Отправить на согласование</h3></div>
    <div class="modal-body"><p>Бланк ${esc(order.blank.id)} в.${order.blank.version} будет отправлен клиенту на согласование.</p></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitSendBlank('${order.id}')">Отправить</button>
    </div>
  `);
}

function submitSendBlank(orderId) {
  const order = Store.getOrderById(orderId);
  if (!order) return;
  const blank = Store.sendBlank(orderId, todayIso());
  if (!blank) return;
  order.history.push(blankHistoryNote(`Бланк ${blank.id} в.${blank.version} отправлен клиенту на согласование`));
  if (typeof notifyBlankSent === "function") notifyBlankSent(order, blank);
  closeModal();
  refreshAfterBlankAction();
}

function openSignBlankModal(orderId) {
  if (!BLANK_SIGN_ROLES.includes(getCurrentRole())) return;
  const order = Store.getOrderById(orderId);
  if (!order || !order.blank) return;
  openModal(`
    <div class="modal-header"><h3>Отметить бланк подписанным</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Кто подписал (ФИО, компания)</label>
        <input id="blankSignedByInput" placeholder="например, Иванов И. (ООО Клиент)" />
      </div>
      <div class="field">
        <label class="field-label">Файл подписанного бланка (необязательно)</label>
        <input id="blankSignedFileInput" value="${esc(order.blank.fileName || "")}" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitSignBlank('${order.id}')">Подписан</button>
    </div>
  `);
}

function submitSignBlank(orderId) {
  const order = Store.getOrderById(orderId);
  if (!order) return;
  const signedBy = document.getElementById("blankSignedByInput").value.trim();
  if (!signedBy) return;
  const fileName = document.getElementById("blankSignedFileInput").value.trim();
  const blank = Store.signBlank(orderId, { signedBy, fileName, today: todayIso() });
  if (!blank) return;
  order.history.push(blankHistoryNote(`Бланк ${blank.id} в.${blank.version} подписан клиентом (${signedBy})`));
  if (typeof syncBlankToDocuments === "function") syncBlankToDocuments(order);
  closeModal();
  refreshAfterBlankAction();
}

function openRejectBlankModal(orderId) {
  if (!BLANK_SIGN_ROLES.includes(getCurrentRole())) return;
  const order = Store.getOrderById(orderId);
  if (!order || !order.blank) return;
  openModal(`
    <div class="modal-header"><h3>Отклонить бланк</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Причина отказа клиента</label>
        <textarea id="blankRejectReasonInput" rows="4" placeholder="Что попросил исправить клиент"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitRejectBlank('${order.id}')">Отклонить</button>
    </div>
  `);
}

function submitRejectBlank(orderId) {
  const order = Store.getOrderById(orderId);
  if (!order) return;
  const reason = document.getElementById("blankRejectReasonInput").value.trim();
  const blank = Store.rejectBlank(orderId, reason);
  if (!blank) return;
  order.history.push(blankHistoryNote(`Бланк ${blank.id} в.${blank.version} отклонён клиентом${reason ? ": " + reason : ""}`));
  closeModal();
  refreshAfterBlankAction();
}

// --- версионность: правка подписанного бланка только через новую версию ---

function openReviseConfirmModal(orderId) {
  if (!BLANK_SEND_ROLES.includes(getCurrentRole())) return;
  const order = Store.getOrderById(orderId);
  if (!order || !order.blank) return;
  const nextVersion = order.blank.version + 1;
  openModal(`
    <div class="modal-header"><h3>Изменить подписанный бланк</h3></div>
    <div class="modal-body"><p>Бланк подписан. Изменение создаст версию ${nextVersion} и потребует повторного согласования.</p></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="closeModal(); openReviseBlankModal('${order.id}')">Продолжить</button>
    </div>
  `);
}

function openReviseBlankModal(orderId) {
  const role = getCurrentRole();
  if (!BLANK_CREATE_ROLES.includes(role) && !BLANK_SEND_ROLES.includes(role)) return;
  const order = Store.getOrderById(orderId);
  if (!order || !order.blank) return;
  const nextVersion = order.blank.version + 1;
  openModal(`
    <div class="modal-header"><h3>Новая версия бланка — в.${nextVersion}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Файл бланка</label>
        <input id="blankReviseFileInput" placeholder="например, blank_${order.id}_v${nextVersion}.jpg" />
      </div>
      <div class="field">
        <label class="field-label">Что изменилось</label>
        <textarea id="blankReviseNoteInput" rows="3" placeholder="Кратко опишите правки"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitReviseBlank('${order.id}')">Создать версию</button>
    </div>
  `);
}

function submitReviseBlank(orderId) {
  const order = Store.getOrderById(orderId);
  if (!order) return;
  const fileName = document.getElementById("blankReviseFileInput").value.trim();
  const note = document.getElementById("blankReviseNoteInput").value.trim();
  const blank = Store.reviseBlank(orderId, { fileName, note });
  if (!blank) return;
  order.history.push(blankHistoryNote(`Создана новая версия бланка ${blank.id} в.${blank.version}`));
  closeModal();
  refreshAfterBlankAction();
}

// --- производственный пакет (карточка заказа, статусы production/ready/done) ---

function blankVersionLineHtml(v) {
  const detail = v.signedBy ? esc(v.signedBy) : (v.note ? esc(v.note) : "");
  return `<div class="pay-history-row"><span>в.${v.version} · ${blankStatusLabel(v.status)}${detail ? " · " + detail : ""}</span></div>`;
}

function openProductionPackageModal(orderId) {
  const order = Store.getOrderById(orderId);
  if (!order) return;
  const knife = order.knifeId ? Store.getKnives().find(k => k.id === order.knifeId) : null;
  const cuttingLabel = {
    knife: knife ? `Нож ${knife.name}` : "Нож",
    laser: "Лазер",
    new_knife: "Новый нож",
  }[order.cuttingType || "knife"] || "—";
  const versionsHtml = (order.blankHistory || []).map(blankVersionLineHtml).join("");

  openModal(`
    <div class="modal-header"><h3>Производственный пакет — #${esc(order.id)}</h3></div>
    <div class="modal-body">
      <p><strong>Бланк:</strong> ${order.blank
        ? `${esc(order.blank.id)} в.${order.blank.version}, подписал ${esc(order.blank.signedBy || "—")} (${formatShortDate(order.blank.signedAt)})`
        : "не создан"}</p>
      ${versionsHtml ? `<p><strong>Прежние версии:</strong></p><div class="pay-history">${versionsHtml}</div>` : ""}
      <p><strong>Материал:</strong> ${esc(order.material || "—")}</p>
      <p><strong>Ламинация:</strong> ${esc(order.lamination || "Нет")}</p>
      <p><strong>Краски:</strong> —</p>
      <p><strong>Станок:</strong> ${esc(order.machine || "—")}</p>
      <p><strong>Размер этикетки:</strong> ${esc(order.labelSize || "—")}</p>
      <p><strong>Высечка:</strong> ${cuttingLabel}</p>
      <p><strong>Тираж:</strong> ${(order.runLength || 0).toLocaleString()} шт.</p>
      <p><strong>Срок отгрузки:</strong> ${order.shipDate ? formatShortDate(order.shipDate) : "—"}</p>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Закрыть</button></div>
  `);
}

// --- экран «Бланки согласования» ---

function blanksGrouped() {
  return {
    draft:    Store.getBlanksByStatus("draft"),
    sent:     Store.getBlanksByStatus("sent"),
    signed:   Store.getBlanksByStatus("signed"),
    rejected: Store.getBlanksByStatus("rejected"),
  };
}

function approvalPendingRowHtml(order, role) {
  const b = order.blank;
  const waiting = daysWaiting(order);
  const waitCell = waiting != null ? `<span class="${waiting > 3 ? "days-waiting-alert" : ""}">${waiting} дн.</span>` : "—";
  const actions = [];
  if (b.status === "draft" && BLANK_SEND_ROLES.includes(role)) {
    actions.push(`<button class="btn btn-ghost btn-sm" onclick="openSendBlankModal('${order.id}')">Отправить</button>`);
  }
  if (b.status === "sent" && BLANK_SIGN_ROLES.includes(role)) {
    actions.push(`<button class="btn btn-ok btn-sm" onclick="openSignBlankModal('${order.id}')">Подписан</button>`);
    actions.push(`<button class="btn btn-ghost btn-sm" onclick="openRejectBlankModal('${order.id}')">Отклонить</button>`);
  }
  return `<tr>
    <td>#${esc(order.id)}</td>
    <td>${esc(order.customer)}</td>
    <td>в.${b.version}</td>
    <td>${b.sentAt ? formatShortDate(b.sentAt) : "—"}</td>
    <td>${waitCell}</td>
    <td><span class="order-actions">${actions.join("") || `<span class="muted">—</span>`}</span></td>
  </tr>`;
}

function approvalResolvedRowHtml(order, role) {
  const b = order.blank;
  const actions = [];
  if (b.status === "signed" && BLANK_SEND_ROLES.includes(role)) {
    actions.push(`<button class="btn btn-ghost btn-sm" onclick="openReviseConfirmModal('${order.id}')">Изменить</button>`);
  }
  if (b.status === "rejected" && BLANK_CREATE_ROLES.includes(role)) {
    actions.push(`<button class="btn btn-primary btn-sm" onclick="openReviseBlankModal('${order.id}')">Создать новую версию</button>`);
  }
  const dateCell = b.status === "signed" ? formatShortDate(b.signedAt) : (b.sentAt ? formatShortDate(b.sentAt) : "—");
  const detailCell = b.status === "signed" ? esc(b.signedBy || "—") : esc(b.note || "—");
  return `<tr>
    <td>#${esc(order.id)}</td>
    <td>${esc(order.customer)}</td>
    <td>в.${b.version}</td>
    <td>${dateCell}</td>
    <td>${detailCell}</td>
    <td><span class="order-actions">${actions.join("") || `<span class="muted">—</span>`}</span></td>
  </tr>`;
}

function renderApprovalGroup(elId, orders, rowFn, role, emptyText) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = orders.length
    ? orders.map(o => rowFn(o, role)).join("")
    : `<tr><td colspan="6" class="muted">${emptyText}</td></tr>`;
}

function updateApprovalCounts(groups) {
  const map = {
    approvalsDraftCount: groups.draft.length,
    approvalsSentCount: groups.sent.length,
    approvalsSignedCount: groups.signed.length,
    approvalsRejectedCount: groups.rejected.length,
  };
  Object.entries(map).forEach(([id, n]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = n;
  });
}

function renderApprovals() {
  const role = getCurrentRole();
  const groups = blanksGrouped();
  renderApprovalGroup("approvalsDraftBody", groups.draft, approvalPendingRowHtml, role, "Нет черновиков.");
  renderApprovalGroup("approvalsSentBody", groups.sent, approvalPendingRowHtml, role, "Нет бланков на согласовании.");
  renderApprovalGroup("approvalsSignedBody", groups.signed, approvalResolvedRowHtml, role, "Нет подписанных бланков.");
  renderApprovalGroup("approvalsRejectedBody", groups.rejected, approvalResolvedRowHtml, role, "Нет отклонённых бланков.");
  updateApprovalCounts(groups);
}

const _navToApprovals = navTo;
navTo = function (id) {
  _navToApprovals(id);
  if (id === "approvals") renderApprovals();
};

renderApprovals();
// достраивает строку бланка на карточках заказов, отрисованных orders.js
// раньше, чем этот файл успел загрузиться
renderOrders();
