const DOCUMENT_MANAGE_ROLES = ["manager", "assistant", "director", "accountant"];

function canEditDocument(doc) {
  return doc.status === "draft";
}

function documentTypeLabel(type) {
  return (Store.getDocumentTypes().find(t => t.key === type) || {}).label || type;
}

// у демо-документов реальный файл есть только для бланков (скопированные образцы) —
// остальные, как и раньше в проекте, условные ссылки (source:'#')
function documentFileHref(doc) {
  if (doc.type === "blank") return doc.version % 2 === 1 ? "assets/blank_sample_1.jpg" : "assets/blank_sample_2.jpg";
  return "#";
}

function documentLinkedLabel(doc) {
  if (doc.orderId) {
    const order = Store.getOrderById(doc.orderId);
    return order ? `Заказ #${order.id}` : `Заказ #${doc.orderId}`;
  }
  if (doc.clientId) {
    const client = Store.getClientById(doc.clientId);
    return client ? client.company : doc.clientId;
  }
  return "—";
}

function pushDocumentHistory(doc, text) {
  const role = getCurrentRole();
  if (doc.orderId) {
    const order = Store.getOrderById(doc.orderId);
    if (order) order.history.push({ text, who: roleNames[role] || role, when: nowLabel() });
  }
  if (doc.clientId) {
    Store.addHistory({
      clientId: doc.clientId, type: "Документы",
      author: staffName(getCurrentStaffId()) || "—", role: roleNames[role],
      date: typeof nowStamp === "function" ? nowStamp() : nowLabel(), text,
    });
  }
}

function refreshAfterDocumentAction() {
  renderDocumentsScreen();
  if (typeof renderClientFiles === "function") renderClientFiles();
  if (typeof renderOrders === "function") renderOrders();
  if (typeof renderClientHistory === "function") renderClientHistory();
}

// --- загрузка ---

function openUploadDocumentModal(prefill = {}) {
  const orderOptions = ['<option value="">— не выбран —</option>']
    .concat(Store.getOrders().map(o => `<option value="${o.id}" ${o.id === prefill.orderId ? "selected" : ""}>${esc(o.id)} — ${esc(o.customer)}</option>`))
    .join("");
  const clientOptions = ['<option value="">— не выбран —</option>']
    .concat(Store.getClients().map(c => `<option value="${c.id}" ${c.id === prefill.clientId ? "selected" : ""}>${esc(c.company)}</option>`))
    .join("");
  const typeOptions = Store.getDocumentTypes().map(t => `<option value="${t.key}" ${t.key === prefill.type ? "selected" : ""}>${esc(t.label)}</option>`).join("");

  openModal(`
    <div class="modal-header"><h3>Загрузить документ</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Тип документа</label>
        <select id="docTypeSelect">${typeOptions}</select>
      </div>
      <div class="field">
        <label class="field-label">Название</label>
        <input id="docNameInput" placeholder="например, Договор поставки № 12" />
      </div>
      <div class="field">
        <label class="field-label">Файл</label>
        <input id="docFileNameInput" placeholder="имя файла" />
      </div>
      <div class="field">
        <label class="field-label">Заказ (необязательно)</label>
        <select id="docOrderSelect">${orderOptions}</select>
      </div>
      <div class="field">
        <label class="field-label">Клиент (необязательно)</label>
        <select id="docClientSelect">${clientOptions}</select>
      </div>
      <div class="field">
        <label class="field-label">Примечание</label>
        <textarea id="docNoteInput" rows="2"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitUploadDocument()">Загрузить</button>
    </div>
  `);
}

function submitUploadDocument() {
  const type = document.getElementById("docTypeSelect").value;
  const name = document.getElementById("docNameInput").value.trim();
  if (!name) return;
  const fileName = document.getElementById("docFileNameInput").value.trim();
  const orderId = document.getElementById("docOrderSelect").value || null;
  const clientId = document.getElementById("docClientSelect").value || null;
  const note = document.getElementById("docNoteInput").value.trim();
  const doc = Store.addDocument({
    type, name, orderId, clientId, fileName, note,
    uploadedBy: getCurrentStaffId(), uploadedAt: todayIso(),
  });
  pushDocumentHistory(doc, `Добавлен документ «${doc.name}» (${documentTypeLabel(doc.type)}, в.${doc.version})`);
  closeModal();
  refreshAfterDocumentAction();
}

// --- версионность: правка активного документа только через новую версию ---

function openReviseConfirmModal(docId) {
  if (!DOCUMENT_MANAGE_ROLES.includes(getCurrentRole())) return;
  const doc = Store.getDocuments().find(d => d.id === docId);
  if (!doc) return;
  openModal(`
    <div class="modal-header"><h3>Изменить документ</h3></div>
    <div class="modal-body"><p>Документ уже в работе. Изменение создаст версию ${doc.version + 1}, текущая уйдёт в архив.</p></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="closeModal(); openReviseDocumentModal('${doc.id}')">Продолжить</button>
    </div>
  `);
}

function openReviseDocumentModal(docId) {
  if (!DOCUMENT_MANAGE_ROLES.includes(getCurrentRole())) return;
  const doc = Store.getDocuments().find(d => d.id === docId);
  if (!doc) return;
  openModal(`
    <div class="modal-header"><h3>Новая версия — в.${doc.version + 1}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Название</label>
        <input id="docReviseNameInput" value="${esc(doc.name)}" />
      </div>
      <div class="field">
        <label class="field-label">Файл</label>
        <input id="docReviseFileNameInput" value="${esc(doc.fileName)}" />
      </div>
      <div class="field">
        <label class="field-label">Что изменилось</label>
        <textarea id="docReviseNoteInput" rows="3"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitReviseDocument('${doc.id}')">Создать версию</button>
    </div>
  `);
}

function submitReviseDocument(docId) {
  const name = document.getElementById("docReviseNameInput").value.trim();
  const fileName = document.getElementById("docReviseFileNameInput").value.trim();
  const note = document.getElementById("docReviseNoteInput").value.trim();
  const doc = Store.reviseDocument(docId, { name, fileName, note, uploadedBy: getCurrentStaffId(), uploadedAt: todayIso() });
  if (!doc) return;
  pushDocumentHistory(doc, `Создана новая версия документа «${doc.name}» — в.${doc.version} (прежняя версия в архиве)`);
  closeModal();
  refreshAfterDocumentAction();
}

// --- архивирование ---

function openArchiveDocumentModal(docId) {
  if (!DOCUMENT_MANAGE_ROLES.includes(getCurrentRole())) return;
  const doc = Store.getDocuments().find(d => d.id === docId);
  if (!doc) return;
  openModal(`
    <div class="modal-header"><h3>Архивировать документ</h3></div>
    <div class="modal-body"><p>Документ «${esc(doc.name)}» будет перемещён в архив. Продолжить?</p></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitArchiveDocument('${doc.id}')">В архив</button>
    </div>
  `);
}

function submitArchiveDocument(docId) {
  const doc = Store.archiveDocument(docId);
  if (!doc) return;
  pushDocumentHistory(doc, `Документ «${doc.name}» перемещён в архив`);
  closeModal();
  refreshAfterDocumentAction();
}

// --- цепочка версий ---

function openDocumentVersionsModal(docId) {
  const chain = Store.getDocumentVersions(docId);
  if (!chain.length) return;
  const rows = chain.map(d =>
    `<div class="pay-history-row"><span>в.${d.version} · ${d.status === "active" ? "активна" : "архив"} · ${esc(staffName(d.uploadedBy))} · ${formatShortDate(d.uploadedAt)}</span></div>`
  ).join("");
  const last = chain[chain.length - 1];
  openModal(`
    <div class="modal-header"><h3>История версий — ${esc(last.name)}</h3></div>
    <div class="modal-body"><div class="pay-history">${rows}</div></div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Закрыть</button></div>
  `);
}

// --- экран «Документы» ---

let documentTypeFilter = "all";
let documentShowArchive = false;
let documentSearchQuery = "";

function renderDocumentTypeFilters() {
  const el = document.getElementById("documentTypeFilters");
  if (!el) return;
  const chips = [{ key: "all", label: "Все" }, ...Store.getDocumentTypes()];
  el.innerHTML = chips.map(c =>
    `<button data-doc-type="${c.key}" class="${c.key === documentTypeFilter ? "active" : ""}">${esc(c.label)}</button>`
  ).join("");
  el.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    documentTypeFilter = btn.dataset.docType;
    renderDocumentsScreen();
  }));
}

function documentsFilterMatch(doc) {
  if (documentTypeFilter !== "all" && doc.type !== documentTypeFilter) return false;
  if (!documentShowArchive && doc.status === "archived") return false;
  if (documentSearchQuery) {
    const q = documentSearchQuery.toLowerCase();
    const hay = `${doc.id} ${doc.name} ${doc.orderId || ""} ${doc.fileName}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function documentRowHtml(doc) {
  const canManage = DOCUMENT_MANAGE_ROLES.includes(getCurrentRole());
  const versions = Store.getDocumentVersions(doc.id);
  const actions = [];
  if (doc.status === "active" && canManage) {
    actions.push(`<button class="btn btn-ghost btn-sm" onclick="openReviseConfirmModal('${doc.id}')">Новая версия</button>`);
    actions.push(`<button class="btn btn-ghost btn-sm" onclick="openArchiveDocumentModal('${doc.id}')">В архив</button>`);
  }
  if (versions.length > 1) {
    actions.push(`<button class="btn btn-ghost btn-sm" onclick="openDocumentVersionsModal('${doc.id}')">История версий</button>`);
  }
  const href = documentFileHref(doc);
  const nameCell = href !== "#" ? `<a href="${esc(href)}" download>${esc(doc.name)}</a>` : esc(doc.name);
  return `<tr>
    <td>${esc(doc.id)}</td>
    <td>${documentTypeLabel(doc.type)}</td>
    <td>${nameCell}</td>
    <td>в.${doc.version}</td>
    <td>${esc(documentLinkedLabel(doc))}</td>
    <td>${esc(staffName(doc.uploadedBy))}</td>
    <td>${formatShortDate(doc.uploadedAt)}</td>
    <td>${doc.status === "active" ? "Активен" : "Архив"}</td>
    <td><span class="order-actions">${actions.join("") || `<span class="muted">—</span>`}</span></td>
  </tr>`;
}

function renderDocumentsScreen() {
  renderDocumentTypeFilters();
  const body = document.getElementById("documentsBody");
  if (!body) return;
  const rows = Store.getDocuments().filter(documentsFilterMatch)
    .sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || "") || b.id.localeCompare(a.id));
  body.innerHTML = rows.length
    ? rows.map(documentRowHtml).join("")
    : `<tr><td colspan="9" class="muted">Документов не найдено.</td></tr>`;
  const toggle = document.getElementById("documentArchiveToggle");
  if (toggle) toggle.classList.toggle("active", documentShowArchive);
}

function toggleDocumentArchive() {
  documentShowArchive = !documentShowArchive;
  renderDocumentsScreen();
}

function bindDocumentSearch() {
  const input = document.getElementById("documentSearchInput");
  if (!input) return;
  input.addEventListener("input", () => {
    documentSearchQuery = input.value.trim();
    renderDocumentsScreen();
  });
}

// --- блок «Документы заказа» (карточка заказа, orders.js — typeof-guard) ---

function getOrderDocumentsHtml(order) {
  const docs = Store.getDocuments({ orderId: order.id, status: "active" });
  const list = docs.map(d => {
    const href = documentFileHref(d);
    const attrs = href !== "#" ? "download" : "";
    return `<a href="${esc(href)}" ${attrs}><span>${documentTypeLabel(d.type)}</span><strong>${esc(d.name)}</strong><small>в.${d.version}</small></a>`;
  }).join("");
  return `<div class="history">
    <div class="history-head">
      <div class="history-title">Документы заказа</div>
      <button class="btn btn-ghost btn-sm" onclick='openUploadDocumentModal({orderId:"${order.id}"})'>Прикрепить документ</button>
    </div>
    <div class="file-grid compact-files">${list || '<p class="muted">Пока нет документов.</p>'}</div>
  </div>`;
}

// --- вкладка «Файлы» карточки клиента (перенесено из shell.js, Фаза 9) ---

function clientDocuments(client) {
  if (!client) return [];
  const orderIds = new Set(Store.getOrdersByClient(client.company).map(o => o.id));
  return Store.getDocuments().filter(d => d.clientId === client.id || (d.orderId && orderIds.has(d.orderId)));
}

function guessDocumentType(name) {
  const n = String(name || "").toLowerCase();
  if (/договор|contract/.test(n)) return "contract";
  if (/специф/.test(n)) return "specification";
  if (/счет|счёт|invoice/.test(n)) return "invoice";
  if (/упд|наклад/.test(n)) return "upd";
  if (/бланк|соглас/.test(n)) return "blank";
  if (/произв.*пакет/.test(n)) return "production_package";
  if (/письмо/.test(n)) return "letter";
  return "other";
}

let clientFileTypeFilter = "all";

function renderClientFileFilters() {
  const el = document.getElementById("clientFileFilters");
  if (!el) return;
  const chips = [{ key: "all", label: "Все" }, ...Store.getDocumentTypes()];
  el.innerHTML = chips.map(c =>
    `<button class="file-filter ${c.key === clientFileTypeFilter ? "active" : ""}" data-file-filter="${c.key}">${esc(c.label)}</button>`
  ).join("");
  el.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    clientFileTypeFilter = btn.dataset.fileFilter;
    renderClientFiles();
  }));
}

function renderClientFiles() {
  renderClientFileFilters();
  const vault = document.getElementById("clientFileVault");
  if (!vault) return;
  const client = typeof currentClient === "function" ? currentClient() : null;
  const docs = clientDocuments(client)
    .filter(d => d.status === "active" && (clientFileTypeFilter === "all" || d.type === clientFileTypeFilter));
  vault.innerHTML = docs.map(d => {
    const href = documentFileHref(d);
    const attrs = href !== "#" ? "download" : "";
    return `<a href="${esc(href)}" ${attrs}><span>${documentTypeLabel(d.type)}</span><strong>${esc(d.name)}</strong><small>в.${d.version}</small></a>`;
  }).join("") || '<div class="empty-state">Файлы этой категории пока не добавлены.</div>';
  updateDocumentCounters();
}

function updateDocumentCounters() {
  const badge = document.getElementById("clientFilesBadge");
  if (badge) badge.textContent = Store.getDocuments({ status: "active" }).length;
}

function bindClientFileUpload() {
  const upload = document.getElementById("clientFileUpload");
  if (!upload) return;
  upload.addEventListener("change", () => {
    const client = typeof currentClient === "function" ? currentClient() : null;
    const files = [...upload.files];
    if (!client || !files.length) { upload.value = ""; return; }
    files.forEach(file => {
      Store.addDocument({
        type: guessDocumentType(file.name), name: file.name, clientId: client.id, orderId: null,
        fileName: file.name, uploadedBy: getCurrentStaffId(), uploadedAt: todayIso(),
      });
    });
    Store.addHistory({
      clientId: client.id, type: "Файлы",
      author: staffName(getCurrentStaffId()) || "—", role: roleNames[getCurrentRole()],
      date: typeof nowStamp === "function" ? nowStamp() : nowLabel(),
      text: `В карточку клиента добавлено файлов: ${files.length}.`,
    });
    refreshAfterDocumentAction();
    upload.value = "";
  });
}

// --- бланки Фазы 8 → реестр (вызывается из approvals.js/submitSignBlank) ---

function syncBlankToDocuments(order) {
  if (!order.blank || order.blank.status !== "signed") return;
  const existing = Store.getDocuments({ orderId: order.id, type: "blank", status: "active" })[0];
  const data = {
    name: `Бланк согласования — ${order.id}`,
    fileName: order.blank.fileName || `${order.blank.id}.jpg`,
    note: `Подписал: ${order.blank.signedBy}`,
    uploadedBy: getCurrentStaffId(), uploadedAt: todayIso(),
  };
  if (existing) {
    Store.reviseDocument(existing.id, data);
  } else {
    Store.addDocument({ type: "blank", orderId: order.id, clientId: null, ...data });
  }
}

const _navToDocuments = navTo;
navTo = function (id) {
  _navToDocuments(id);
  if (id === "documents") renderDocumentsScreen();
};

bindDocumentSearch();
bindClientFileUpload();
renderDocumentsScreen();
renderClientFiles();
renderOrders();
