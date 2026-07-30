let taskFilterMine = false;

function isTaskOverdue(task) {
  if (task.status === "done" || !task.dueDate) return false;
  const d = parseDateStr(task.dueDate);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return d && d < today;
}

function taskLinkLabel(task) {
  if (task.orderId) {
    const o = Store.getOrderById(task.orderId);
    return o ? `Заказ ${o.id} · ${o.title}` : `Заказ ${task.orderId}`;
  }
  if (task.clientId) {
    const c = Store.getClientById(task.clientId);
    return c ? c.company : "Клиент";
  }
  return "Без связи";
}

function visibleTasks() {
  const all = Store.getTasks();
  if (!taskFilterMine) return all;
  const me = getCurrentStaffId();
  return all.filter(t => t.assigneeId === me);
}

function renderTasksBoard() {
  const board = document.getElementById("tasksBoard");
  if (!board) return;
  const items = visibleTasks();
  board.innerHTML = Store.getTaskStatuses().map(st => {
    const inColumn = items.filter(t => t.status === st.key);
    const cards = inColumn.map(t => {
      const overdueCls = isTaskOverdue(t) ? " overdue-task" : "";
      const hotCls = t.priority === "Высокий" && t.status !== "done" ? " hot" : "";
      const doneCls = t.status === "done" ? " done" : "";
      return `<article class="task-card${hotCls}${doneCls}${overdueCls}" data-task-id="${t.id}">
        <small>${esc(t.id)}</small>
        <strong>${esc(t.title)}</strong>
        <span>${esc(staffName(t.assigneeId))} · ${esc(taskLinkLabel(t))}${t.dueDate ? " · срок " + formatDate(t.dueDate) : ""}</span>
        <div class="task-card-actions">
          <button class="small-btn" data-task-advance="${t.id}">${t.status === "done" ? "Вернуть" : "→ " + nextTaskStatusLabel(t.status)}</button>
        </div>
      </article>`;
    }).join("");
    return `<div class="task-column"><h4>${esc(st.label)} · ${inColumn.length}</h4>${cards}</div>`;
  }).join("");

  board.querySelectorAll("[data-task-advance]").forEach(btn =>
    btn.addEventListener("click", () => advanceTask(btn.dataset.taskAdvance))
  );
}

function nextTaskStatusLabel(currentKey) {
  const statuses = Store.getTaskStatuses();
  const i = statuses.findIndex(s => s.key === currentKey);
  const next = statuses[i + 1];
  return next ? next.label : "Выполнено";
}

function advanceTask(taskId) {
  const task = Store.getTaskById(taskId);
  if (!task) return;
  const statuses = Store.getTaskStatuses();
  const i = statuses.findIndex(s => s.key === task.status);
  task.status = task.status === "done" ? "new" : (statuses[i + 1] || statuses[i]).key;
  renderTasksBoard();
  if (typeof renderClientTasks === "function") renderClientTasks();
}

function populateTaskForm() {
  const assigneeSel = document.getElementById("taskAssigneeSelect");
  const linkSel = document.getElementById("taskLinkSelect");
  if (assigneeSel) {
    assigneeSel.innerHTML = Store.getStaff().map(p => `<option value="${p.id}">${esc(formatPersonName(p))}</option>`).join("");
  }
  if (linkSel) {
    const clientOptions = Store.getClients().map(c => `<option value="client:${c.id}">Клиент · ${esc(c.company)}</option>`).join("");
    const orderOptions = Store.getOrders().map(o => `<option value="order:${o.id}">Заказ · ${esc(o.id)} ${esc(o.title)}</option>`).join("");
    linkSel.innerHTML = `<option value="">Без связи</option>${clientOptions}${orderOptions}`;
  }
}

function submitTask() {
  const assigneeId = Number(document.getElementById("taskAssigneeSelect").value) || null;
  const title = document.getElementById("taskTitleInput").value.trim();
  const linkVal = document.getElementById("taskLinkSelect").value;
  const dueDate = document.getElementById("taskDueInput").value;
  const priority = document.getElementById("taskPrioritySelect").value;
  const description = document.getElementById("taskDescInput").value.trim();
  if (!title || !assigneeId) return;

  const assignee = Store.getStaff().find(p => p.id === assigneeId);
  const [linkType, linkId] = linkVal ? linkVal.split(":") : [null, null];

  const task = Store.addTask({
    title, description, dueDate, priority,
    assigneeId, role: assignee ? assignee.role : null,
    clientId: linkType === "client" ? linkId : null,
    orderId: linkType === "order" ? linkId : null,
    status: "new",
    createdBy: getCurrentStaffId(),
  });

  if (typeof notifyNewTask === "function") notifyNewTask(task);

  if (task.clientId) {
    Store.addHistory({
      clientId: task.clientId, type: "Задача", author: staffName(getCurrentStaffId()) || "—",
      role: roleNames[getCurrentRole()], date: nowStamp(), text: `Назначена задача ${task.id}: ${title} — ${staffName(assigneeId)}.`,
    });
    if (typeof renderClientHistory === "function") renderClientHistory();
    if (typeof renderClientTasks === "function") renderClientTasks();
  }

  document.getElementById("taskTitleInput").value = "";
  document.getElementById("taskDueInput").value = "";
  document.getElementById("taskDescInput").value = "";
  renderTasksBoard();
}

function bindTasksPage() {
  document.querySelectorAll('[data-task-filter]').forEach(btn => btn.addEventListener("click", () => {
    taskFilterMine = btn.dataset.taskFilter === "mine";
    document.querySelectorAll('[data-task-filter]').forEach(b => b.classList.toggle("active", b === btn));
    renderTasksBoard();
  }));
  document.getElementById("submitTaskBtn")?.addEventListener("click", submitTask);
}

populateTaskForm();
bindTasksPage();
renderTasksBoard();
