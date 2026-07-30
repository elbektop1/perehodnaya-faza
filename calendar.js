let calendarFilter = "mine";

// переиспользуем уже стилизованные модификаторы .cal-event (contract/order/task/delivery)
// вместо новых CSS-классов под каждый EVENT_TYPES.key
const EVENT_TYPE_CLASS = { call: "", task: "task", order_deadline: "order", shipment: "delivery", payment: "contract" };
function eventTypeLabel(key) {
  return Store.getEventTypes().find(t => t.key === key)?.label || key;
}

function isEventOverdue(ev) {
  if (ev.done || !ev.date) return false;
  const d = parseDateStr(ev.date);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return d && d < today;
}

function weekdayName(dateStr) {
  const names = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const d = parseDateStr(dateStr);
  return d ? names[d.getDay()] : "Без даты";
}

function eventLinkLabel(ev) {
  if (ev.orderId) {
    const o = Store.getOrderById(ev.orderId);
    return o ? `Заказ ${o.id} · ${o.title}` : `Заказ ${ev.orderId}`;
  }
  if (ev.clientId) {
    const c = Store.getClientById(ev.clientId);
    return c ? c.company : "";
  }
  return "";
}

function visibleEvents() {
  const all = Store.getEvents();
  const me = getCurrentStaffId();
  switch (calendarFilter) {
    case "mine": return all.filter(e => e.assigneeId === me);
    case "company": return all.filter(e => ["order_deadline", "shipment", "payment"].includes(e.type));
    case "orders": return all.filter(e => e.orderId);
    case "overdue": return all.filter(isEventOverdue);
    case "team":
    default: return all;
  }
}

function renderCalendar() {
  const board = document.getElementById("calendarBoard");
  if (!board) return;
  const items = visibleEvents().slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const byDate = {};
  items.forEach(ev => { (byDate[ev.date] = byDate[ev.date] || []).push(ev); });
  const dates = Object.keys(byDate).sort();

  board.innerHTML = dates.map(date => {
    const dayEvents = byDate[date].map(ev => {
      const cls = EVENT_TYPE_CLASS[ev.type] || "";
      const overdueCls = isEventOverdue(ev) ? " overdue-task" : "";
      const doneCls = ev.done ? " done" : "";
      const link = eventLinkLabel(ev);
      return `<article class="cal-event ${cls}${doneCls}${overdueCls}">
        <strong>${esc(ev.time || "")} · ${esc(ev.title)}</strong>
        <span>${esc(eventTypeLabel(ev.type))} · ${esc(staffName(ev.assigneeId))}${link ? " · " + esc(link) : ""}</span>
        <div class="cal-event-actions">
          <button class="small-btn" data-event-toggle="${ev.id}">${ev.done ? "Вернуть" : "Готово"}</button>
        </div>
      </article>`;
    }).join("");
    return `<div class="calendar-day"><h4>${esc(weekdayName(date))} · ${esc(formatDate(date))}</h4>${dayEvents}</div>`;
  }).join("") || '<div class="empty-state">Событий по этому фильтру нет.</div>';

  board.querySelectorAll("[data-event-toggle]").forEach(btn =>
    btn.addEventListener("click", () => { Store.toggleEventDone(btn.dataset.eventToggle); renderCalendar(); })
  );
}

function openAddEventModal() {
  const typeOptions = Store.getEventTypes().map(t => `<option value="${t.key}">${esc(t.label)}</option>`).join("");
  const assigneeOptions = Store.getStaff().map(p => `<option value="${p.id}">${esc(formatPersonName(p))}</option>`).join("");
  const orderOptions = Store.getOrders().map(o => `<option value="order:${o.id}">Заказ · ${esc(o.id)} ${esc(o.title)}</option>`).join("");
  const clientOptions = Store.getClients().map(c => `<option value="client:${c.id}">Клиент · ${esc(c.company)}</option>`).join("");

  openModal(`
    <div class="modal-header"><h3>Новое событие</h3></div>
    <div class="modal-body">
      <div class="field"><label class="field-label">Заголовок</label><input id="newEventTitle" /></div>
      <div class="field"><label class="field-label">Тип</label><select id="newEventType">${typeOptions}</select></div>
      <div class="field"><label class="field-label">Дата</label><input type="date" id="newEventDate" /></div>
      <div class="field"><label class="field-label">Время</label><input type="time" id="newEventTime" /></div>
      <div class="field"><label class="field-label">Кому</label><select id="newEventAssignee">${assigneeOptions}</select></div>
      <div class="field"><label class="field-label">Связь</label><select id="newEventLink"><option value="">Без связи</option>${clientOptions}${orderOptions}</select></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitEvent()">Добавить</button>
    </div>
  `);
}

function submitEvent() {
  const title = document.getElementById("newEventTitle").value.trim();
  const date = document.getElementById("newEventDate").value;
  if (!title || !date) return;
  const linkVal = document.getElementById("newEventLink").value;
  const [linkType, linkId] = linkVal ? linkVal.split(":") : [null, null];

  Store.addEvent({
    title, date,
    type: document.getElementById("newEventType").value,
    time: document.getElementById("newEventTime").value,
    assigneeId: Number(document.getElementById("newEventAssignee").value) || null,
    clientId: linkType === "client" ? linkId : null,
    orderId: linkType === "order" ? linkId : null,
    done: false,
  });
  closeModal();
  renderCalendar();
}

function bindCalendarPage() {
  document.getElementById("addEventBtn")?.addEventListener("click", openAddEventModal);
  document.querySelectorAll("[data-cal-filter]").forEach(btn => btn.addEventListener("click", () => {
    calendarFilter = btn.dataset.calFilter;
    document.querySelectorAll("[data-cal-filter]").forEach(b => b.classList.toggle("active", b === btn));
    renderCalendar();
  }));
}

bindCalendarPage();
renderCalendar();
