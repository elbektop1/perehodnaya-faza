// роли/меню/статусы/переходы — таблицы данных, функции только читают их и рендерят
const STAFF = [
  // Директор
  { id: 1,  name: "Кылычев Алик",         role: "director",   photo: null },

  // Помощник директора (урезанный доступ — без финансов)
  { id: 2,  name: "Богомолова Виктория",  role: "assistant",  photo: null },

  // Менеджеры по продажам
  { id: 10, name: "Лукина Римма",         role: "manager",    photo: null },
  { id: 11, name: "Шаповалова Юлия",      role: "manager",    photo: null },
  { id: 12, name: "Шаповалов Дмитрий",    role: "manager",    photo: null },
  { id: 13, name: "Денисова Татьяна",     role: "manager",    photo: null },
  { id: 14, name: "Овечкин Константин",   role: "manager",    photo: null },
  { id: 15, name: "Одинцов Алексей",      role: "manager",    photo: null },
  { id: 16, name: "Баранов Александр",    role: "manager",    photo: null },
  { id: 17, name: "Володин Александр",    role: "manager",    photo: null },

  // Дизайнеры
  { id: 20, name: "Одинцов Вадим",        role: "designer",   photo: null },
  { id: 21, name: "Ботов Глеб",           role: "designer",   photo: null },

  // Экономист (закупщик)
  { id: 40, name: "Бейгул Дмитрий",       role: "economist",  photo: null },

  // Бухгалтер
  { id: 45, name: "Алексеева Яна",        role: "accountant", photo: null },

  // Менеджер производства (сборщик форм)
  { id: 50, name: "Щербакова Юлия",       role: "production_manager", photo: null },

  // Печатники
  { id: 60, name: "Кондратьев Алексей",   role: "worker",     photo: null },
  { id: 61, name: "Замятин Александр",    role: "worker",     photo: null },
  { id: 62, name: "Дурдиев Атаджан",      role: "worker",     photo: null },
  { id: 63, name: "Курбанбаев Хамид",     role: "worker",     photo: null },
  { id: 64, name: "Керимов Анатолий",     role: "worker",     photo: null },
  { id: 65, name: "Авезов Шатлык",        role: "worker",     photo: null },
  { id: 66, name: "Байрам",               role: "worker",     photo: null },

  // IT / администратор системы
  { id: 99, name: "Дерябин Юрий",         role: "admin",      photo: null },
];

function staffByRole(role) {
  return STAFF.filter(p => p.role === role);
}
function getRoleLabel(role) {
  return ROLE_LABELS[role];
}
function formatPersonName(person) {
  return `${person.name} (${getRoleLabel(person.role)})`;
}
function staffName(id) {
  const p = STAFF.find(s => s.id === id);
  return p ? formatPersonName(p) : "—";
}

// кто кому может писать: director/assistant — любому; designer — только другим дизайнерам
function renderWriteButton(person) {
  const myId = STAFF.find(s => s.role === currentRole)?.id;
  const canWrite = currentRole === "director" || currentRole === "assistant"
    || (currentRole === "designer" && person.role === "designer" && person.id !== myId);
  if (!canWrite) return "";
  return `<button class="btn btn-ghost btn-sm" onclick="openChatWith(${person.id})">Написать</button>`;
}

// без похожих символов I/O/1/0; вызывается только когда orders уже проинициализирован
function generateOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return orders.some(o => o.id === id) ? generateOrderId() : id;
}

// currentRole позже будет заполняться ответом сервера вместо экрана "войти как"
const ROLE_LABELS = {
  director:   "Директор",
  assistant:  "Помощник директора",
  manager:    "Менеджер",
  designer:   "Дизайнер",
  economist:  "Экономист",
  accountant: "Бухгалтер",
  worker:     "Печатник",
  production_manager: "Менеджер производства",
  admin:      "Администратор",
};

let currentRole = null;

// page:"new" — не раздел, а ярлык модалки создания заказа (см. goto())
const MENU_BY_ROLE = {
  director: [
    { page: "orders",            label: "Заказы"},
    { page: "dashboard",         label: "Загрузка"},
    { page: "staff",             label: "Сотрудники"},
    { page: "archive",           label: "Архив" },
    { page: "materials-report",  label: "Материалы"},
    { page: "proposals",         label: "Предложения"},
    { page: "finance",           label: "Финансы" },
    { page: "earnings",          label: "Заработок"},
    { page: "calculator",        label: "Калькулятор"},
    { page: "chat",              label: "Чат",},
  ],
  assistant: [
    { page: "orders",    label: "Заказы"},
    { page: "designers", label: "Дизайнеры"},
    { page: "workers",   label: "Производство"},
    { page: "dashboard", label: "Загрузка"},
    { page: "archive",   label: "Архив"},
    { page: "chat",      label: "Чат"},
  ],
  manager: [
    { page: "orders",    label: "Заказы"},
    { page: "new",       label: "Создать заказ"},
    { page: "designers", label: "Дизайнеры"},
    { page: "workers",   label: "Производство"},
    { page: "dashboard", label: "Загрузка"},
    { page: "archive",   label: "Архив"},
    { page: "chat",      label: "Чат"},
  ],
  designer: [
    { page: "orders", label: "Мои задачи"},
    { page: "chat",   label: "Чат"},
  ],
  worker: [
    { page: "orders", label: "Мои задачи"},
    { page: "chat",   label: "Чат"},
  ],
  economist: [
    { page: "orders",           label: "Заказы"},
    { page: "finance",          label: "Финансы"},
    { page: "archive",          label: "Архив"},
    { page: "materials-report", label: "Материалы"},
    { page: "proposals",        label: "Предложения"},
    { page: "chat",             label: "Чат"},
  ],
  accountant: [
    { page: "orders",           label: "Заказы"},
    { page: "finance",          label: "Финансы"},
    { page: "archive",          label: "Архив"},
    { page: "materials-report", label: "Материалы"},
    { page: "chat",             label: "Чат"},
  ],
  production_manager: [
    { page: "production-plan", label: "План производства"},
    { page: "orders",          label: "Все заказы"},
    { page: "staff",           label: "Сотрудники"},
    { page: "chat",            label: "Чат"},
  ],
  admin: [
    { page: "orders",           label: "Заказы"},
    { page: "staff",            label: "Сотрудники"},
    { page: "users",            label: "Пользователи"},
    { page: "archive",          label: "Архив"},
    { page: "materials-report", label: "Материалы"},
    { page: "chat",             label: "Чат",},
  ],
};

// первые 4 пункта нижней навигации на мобильном; всё остальное уходит в "Ещё"
const MOBILE_NAV = ["orders", "dashboard", "archive", "finance"];

// null — видит все статусы; designer/worker видят только свой этап (это их очередь)
const ROLE_ORDER_FILTER = {
  manager:    null,
  designer:   ["design", "rework"],
  worker:     ["production"],
  director:   null,
  assistant:  null,
  economist:  null,
  accountant: null,
  production_manager: null,
  admin:      null,
};

const ROLE_PAGE_SUB = {
  manager:    "Все текущие заказы в работе",
  designer:   "Заказы, ожидающие вашей работы",
  worker:     "Заказы в производстве",
  director:   "Все заказы компании",
  assistant:  "Все текущие заказы в работе",
  economist:  "Все заказы компании",
  accountant: "Все заказы компании",
  production_manager: "Все заказы компании",
  admin:      "Все заказы компании",
};

// раздела нет в списке → goto() покажет заглушку "раздел в разработке"
const STATIC_PAGE_SUB = {
  designers:         "Занятость дизайнеров",
  workers:           "Занятость в производстве",
  staff:             "Кто чем занят сейчас",
  archive:           "Завершённые заказы",
  "materials-report": "Расход материалов по заказам",
  finance:           "Оплата по всем заказам",
  calculator:        "Расчёт себестоимости",
  "production-plan": "Очередь заказов в производстве",
  users:             "Управление учётками сотрудников",
  proposals:         "Предложения по закупкам на рассмотрение директору",
  earnings:          "Выручка, себестоимость и прибыль по заказам",
};

// key — используется и как класс цвета бейджа в CSS
const STATUSES = [
  { key: "new",        label: "Новый" },
  { key: "design",     label: "У дизайнера" },
  { key: "rework",     label: "На доработке" },
  { key: "approval",   label: "На согласовании" },
  { key: "production", label: "В производстве" },
  { key: "ready",      label: "Готов к отгрузке" },
  { key: "done",        label: "Готово" },
];
function getStatus(key) { return STATUSES.find(s => s.key === key); }

// to/label/role — куда/подпись/кто может; assignTo — нужен выбор исполнителя; comment — нужен комментарий
const TRANSITIONS = {
  new: [
    { to: "design",     label: "Передать дизайнеру", role: "manager", assignTo: "designer", primary: true },
    { to: "production", label: "Сразу в производство", role: "manager", assignTo: "worker" },
  ],
  design: [
    // self-loop: фиксируем принятие без смены статуса, historyText нужен т.к. HISTORY_TEXT["design"] занят другим переходом
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
    // requiresAccepted — кнопка появляется только после "принять в работу" (пошаговый процесс печатника)
    { to: "ready",      label: "Готово к отгрузке", role: "worker", primary: true, variant: "ok", requiresAccepted: true },
    // без requiresAccepted — печатник сообщает о проблеме на любом шаге, даже до принятия;
    // historyText задан явно — иначе "to: approval" совпал бы с HISTORY_TEXT.approval ("Отправлен на согласование")
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

// hasProblem ставит/снимает applyPendingAction по флагу action.problem
let orders = [
  {
    id: "RL7X2A", title: "Этикетки для сока «Сады»", customer: "ООО Сады",
    status: "new", assignee: null,
    hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "client@test.ru", priority: 0,
    knifeId: null, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
    clientPrice: null, costPrice: null,
    runLength: 5000, orderType: "new", labelSize: "60×40 мм",
    material: "Бумага полуглянец акрил", lamination: "Нет", machine: "GALLUS 160",
    shipDate: "2026-07-15", manager: ROLE_LABELS.manager,
    history: [ { text: "Заказ создан", who: "менеджер", when: "12 июн, 10:24" } ],
  },
  {
    id: "KP5W9B", title: "Наклейки на банки мёда", customer: "ИП Иванов",
    status: "design", assignee: 20,
    hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: 14, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
    clientPrice: null, costPrice: null,
    runLength: 12000, orderType: "repeat", labelSize: "55×55 мм",
    material: "Пленка PP белая акрил", lamination: "Ламинация глянец", machine: "WEIGANG",
    shipDate: "2026-07-20", manager: ROLE_LABELS.manager,
    history: [
      { text: "Заказ создан",       who: "менеджер", when: "11 июн, 14:02" },
      { text: "Передан дизайнеру (Одинцов Вадим)", who: "менеджер", when: "11 июн, 15:30" },
    ],
  },

  // тестовые done-заказы с paid true/false — чтобы архив и финансы не были пустой демонстрацией
  {
    id: "MN3J4C", title: "Этикетка PP глянец 55×55", customer: "ООО Кимберли",
    status: "done", assignee: 60,
    hasProblem: false, paid: true, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: 14, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
    clientPrice: 62000, costPrice: 41000,
    runLength: 20000, orderType: "repeat", labelSize: "55×55 мм",
    material: "Пленка PP белая акрил", lamination: "Ламинация глянец", machine: "WEIGANG",
    shipDate: "2026-06-20", manager: "Лукина Римма",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "10 июн, 09:00" },
      { text: "Передан дизайнеру (Одинцов Вадим)", who: "менеджер", when: "10 июн, 10:00" },
      { text: "Отправлен на согласование", who: "дизайнер", when: "11 июн, 14:00" },
      { text: "Запущен в производство (Кондратьев Алексей)", who: "менеджер", when: "12 июн, 09:00" },
      { text: "Заказ выполнен", who: "печатник", when: "14 июн, 17:00" },
    ],
  },
  {
    id: "QT8R6D", title: "Этикетка для мёда, термоэко", customer: "ИП Абишев",
    status: "done", assignee: 61,
    hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: null, cuttingType: "laser", needNewKnife: false, createdBy: 10, paymentDue: "2026-07-10",
    clientPrice: 21000, costPrice: 15500,
    runLength: 8000, orderType: "new", labelSize: "50×30 мм",
    material: "Термоэко", lamination: "Нет", machine: "Darui (лазерный)",
    shipDate: "2026-06-22", manager: "Лукина Римма",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "15 июн, 08:30" },
      { text: "Передан дизайнеру (Ботов Глеб)", who: "менеджер", when: "15 июн, 09:15" },
      { text: "Отправлен на согласование", who: "дизайнер", when: "16 июн, 13:00" },
      { text: "Запущен в производство (Замятин Александр)", who: "менеджер", when: "17 июн, 10:00" },
      { text: "Заказ выполнен", who: "печатник", when: "18 июн, 16:30" },
    ],
  },
  {
    id: "YH2K5E", title: "Этикетка для варенья, металл", customer: "ООО Дары Природы",
    status: "done", assignee: 62,
    hasProblem: false, paid: true, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: null, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
    clientPrice: null, costPrice: null,
    runLength: 15000, orderType: "repeat_changed", labelSize: "70×50 мм",
    material: "Пленка метализированная акрил", lamination: "Тиснение золото", machine: "GALLUS 200",
    shipDate: "2026-06-25", manager: "Лукина Римма",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "18 июн, 11:00" },
      { text: "Передан дизайнеру (Одинцов Вадим)", who: "менеджер", when: "18 июн, 11:40" },
      { text: "Отправлен на согласование", who: "дизайнер", when: "19 июн, 15:20" },
      { text: "Запущен в производство (Дурдиев Атаджан)", who: "менеджер", when: "20 июн, 09:30" },
      { text: "Заказ выполнен", who: "печатник", when: "21 июн, 18:00" },
    ],
  },
  {
    id: "FW4N7G", title: "Этикетка для замороженных ягод", customer: "ООО СеверПродукт",
    status: "done", assignee: 63,
    hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: null, cuttingType: "new_knife", needNewKnife: true, createdBy: 10, paymentDue: "2026-07-05",
    clientPrice: null, costPrice: null,
    runLength: 30000, orderType: "new", labelSize: "100×70 мм",
    material: "Бумага полуглянец глубокая заморозка", lamination: "Ламинация матовая", machine: "WEIGANG",
    shipDate: "2026-06-28", manager: "Лукина Римма",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "20 июн, 10:00" },
      { text: "Передан дизайнеру (Ботов Глеб)", who: "менеджер", when: "20 июн, 10:45" },
      { text: "Отправлен на согласование", who: "дизайнер", when: "21 июн, 16:00" },
      { text: "Запущен в производство (Курбанбаев Хамид)", who: "менеджер", when: "22 июн, 09:00" },
      { text: "Заказ выполнен", who: "печатник", when: "24 июн, 17:45" },
    ],
  },

  // демо-заказы для показа заказчику — вся цепочка статусов в одном заходе
  {
    id: "DS2K8P", title: "Этикетка для соусов «Апельсин»", customer: "ИП Иванов",
    status: "design", assignee: 20,
    hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: null, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
    clientPrice: null, costPrice: null,
    runLength: 6000, orderType: "new", labelSize: "58×40 мм",
    material: "Пленка PP белая на PET подложке", lamination: "Нет", machine: "BENGRAPHIC",
    shipDate: "2026-07-18", manager: "Лукина Римма",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "1 июл, 09:10" },
      { text: "Передан дизайнеру (Одинцов Вадим)", who: "менеджер", when: "1 июл, 09:40" },
    ],
  },
  {
    id: "AP9M3L", title: "Этикетка для мыла ручной работы", customer: "ООО Дары Природы",
    status: "approval", assignee: 21,
    hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: true, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: null, cuttingType: "laser", needNewKnife: false, createdBy: 10, paymentDue: "2026-07-12",
    clientPrice: null, costPrice: null,
    runLength: 4000, orderType: "new", labelSize: "50×30 мм",
    material: "Бумага матовая", lamination: "Ламинация soft touch", machine: "Darui (лазерный)",
    shipDate: "2026-07-14", manager: "Шаповалова Юлия",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "2 июл, 11:00" },
      { text: "Передан дизайнеру (Ботов Глеб)", who: "менеджер", when: "2 июл, 11:20" },
      { text: "Отправлен на согласование", who: "дизайнер", when: "3 июл, 15:40" },
    ],
  },
  {
    id: "PR4T7X", title: "Этикетка для консервации «Дары лета»", customer: "ООО СеверПродукт",
    status: "production", assignee: 60,
    hasProblem: false, paid: true, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: 19, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
    clientPrice: 54000, costPrice: 39000,
    runLength: 18000, orderType: "repeat_changed", labelSize: "58×60 мм",
    material: "Пленка PE 100 мкр белая", lamination: "Нет", machine: "WEIGANG",
    shipDate: "2026-07-11", manager: "Лукина Римма",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "28 июн, 10:00" },
      { text: "Передан дизайнеру (Одинцов Вадим)", who: "менеджер", when: "28 июн, 10:30" },
      { text: "Отправлен на согласование", who: "дизайнер", when: "29 июн, 14:10" },
      { text: "Запущен в производство (Кондратьев Алексей)", who: "менеджер", when: "30 июн, 09:00" },
    ],
  },
  {
    id: "RD6W1H", title: "Этикетка для мёда «Пасека»", customer: "ИП Абишев",
    status: "ready", assignee: 61,
    hasProblem: false, paid: false, expanded: false, acceptedBy: 61, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
    knifeId: 13, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
    clientPrice: 33000, costPrice: 36000,
    runLength: 10000, orderType: "new", labelSize: "50×70 мм",
    material: "Термо Топ", lamination: "Нет", machine: "GALLUS 160",
    shipDate: "2026-07-10", manager: "Шаповалов Дмитрий",
    history: [
      { text: "Заказ создан", who: "менеджер", when: "25 июн, 08:00" },
      { text: "Передан дизайнеру (Ботов Глеб)", who: "менеджер", when: "25 июн, 08:30" },
      { text: "Отправлен на согласование", who: "дизайнер", when: "26 июн, 13:00" },
      { text: "Запущен в производство (Замятин Александр)", who: "менеджер", when: "27 июн, 09:00" },
      { text: "Принято в работу", who: "печатник", when: "27 июн, 09:20" },
      { text: "Готово к отгрузке — ожидает подтверждения менеджера", who: "печатник", when: "2 июл, 16:00" },
    ],
  },
];

// Предложения экономиста по закупкам — на рассмотрение директору
let PROPOSALS = [];
// { id, title, link, price, comment, proposedBy, status: "pending"|"approved"|"rejected", createdAt }

// Чаты в памяти — демо-витрина для показа заказчику, не персистентно.
// Реальный чат с сохранением истории будет на WebSocket в Spring Boot версии (этап 2).
let CHATS = [];
// { id, participants: [staffId1, staffId2], messages: [{from, text, when}] }
let openChatId = null;

// loginScreen/roleScreen/appScreen взаимоисключающие — hidden всегда ровно у двух из трёх

/* временно отключено — экран логина закомментирован и в index.html, см. восстановление там
function login() {
  const user = document.getElementById("loginInput").value;
  const pass = document.getElementById("passwordInput").value;
  const errorBox = document.getElementById("loginError");

  // заглушка: реальной авторизации нет, это прототип
  if (user === "user" && pass === "pass") {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("roleScreen").classList.remove("hidden");
    renderRolePicker();
  } else {
    errorBox.textContent = "Неверный логин или пароль";
  }
}
*/

function renderRolePicker() {
  const box = document.getElementById("rolePickList");
  box.innerHTML = Object.keys(ROLE_LABELS).map(roleKey =>
    `<button class="btn btn-ghost btn-full role-pick-btn" onclick="chooseRole('${roleKey}')">${ROLE_LABELS[roleKey]}</button>`
  ).join("");
}

function chooseRole(role) {
  currentRole = role;
  openChatId = null;
  currentFilter = "all";
  financeFilter = "all";
  dashboardPeriod = "current";
  dashboardCustomer = "all";
  dashboardMaterial = "all";
  document.getElementById("roleScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.remove("hidden");

  renderMenu();
  goto(MENU_BY_ROLE[role][0].page);
}

function logout() {
  document.getElementById("appScreen").classList.add("hidden");
  // пока логин отключён — после выхода сразу на выбор роли, а не на логин
  document.getElementById("roleScreen").classList.remove("hidden");
  currentRole = null;
  openChatId = null;
  currentFilter = "all";
  financeFilter = "all";
  dashboardPeriod = "current";
  dashboardCustomer = "all";
  dashboardMaterial = "all";
}

function renderMenu() {
  const roleLabel = ROLE_LABELS[currentRole];
  document.getElementById("userName").textContent = roleLabel;
  document.getElementById("userAvatar").textContent = roleLabel[0];
  document.getElementById("userRoleLabel").textContent = "Сотрудник";
  const nav = document.getElementById("navList");

  const allItems = MENU_BY_ROLE[currentRole];
  let mobileItems = [];
  
  // 1. Оставить те, чей page есть в MOBILE_NAV, в порядке MOBILE_NAV
  MOBILE_NAV.forEach(page => {
    const item = allItems.find(i => i.page === page);
    if (item) mobileItems.push(item);
  });
  
  // 2. Добить следующими её пунктами по порядку до 4
  const remainingItems = allItems.filter(i => !mobileItems.includes(i));
  while (mobileItems.length < 4 && remainingItems.length > 0) {
    mobileItems.push(remainingItems.shift());
  }
  
  // Обрезаем до 4 на всякий случай
  mobileItems = mobileItems.slice(0, 4);
  
  // 3. Пятым всегда «Ещё»
  const menuToRender = [...mobileItems, { page: "more", label: "Ещё" }];

  nav.innerHTML = menuToRender.map(item => {
    if (item.page === "more") {
      return `<div class="nav-item nav-item--more" onclick="openMoreModal()">Ещё</div>`;
    }
    return `<div class="nav-item" data-page="${item.page}" onclick="goto('${item.page}')">${item.label}</div>`;
  }).join("");
}

// Новая функция для модалки "Ещё"
function openMoreModal() {
  const allItems = MENU_BY_ROLE[currentRole];
  let mobileItems = [];
  MOBILE_NAV.forEach(page => {
    const item = allItems.find(i => i.page === page);
    if (item) mobileItems.push(item);
  });
  const remainingItems = allItems.filter(i => !mobileItems.includes(i));
  while (mobileItems.length < 4 && remainingItems.length > 0) {
    mobileItems.push(remainingItems.shift());
  }
  mobileItems = mobileItems.slice(0, 4);
  
  const moreItems = allItems.filter(i => !mobileItems.includes(i));
  
  const moreHtml = moreItems.map(item => 
    `<div class="nav-item" style="justify-content: flex-start; padding: 12px 16px; border-radius: 8px;" onclick="goto('${item.page}'); closeModal();">${item.label}</div>`
  ).join("");
  
  openModal(`
    <div class="modal-header"><h3>Разделы</h3></div>
    <div class="modal-body" style="display:flex; flex-direction:column; gap:4px; padding: 8px 0;">
      ${moreHtml}
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost btn-full" onclick="logout(); closeModal();">Выйти из системы</button>
    </div>
  `);
}
// секции лежат в HTML как <section id="page-<page>">, совпадает с page у пункта меню
function goto(page) {
  // ярлык модалки, а не отдельный раздел
  if (page === "new") {
    openCreateOrderModal();
    return;
  }

  // доступ строго директору, остальным ролям пункта меню и так нет — доп. защита на клиенте
  if (page === "calculator" && currentRole !== "director") {
    return;
  }

  document.querySelectorAll("#navList .nav-item").forEach(el => el.classList.remove("active"));
  const clicked = document.querySelector(`#navList .nav-item[data-page="${page}"]`);
  if (clicked) clicked.classList.add("active");

  document.querySelectorAll(".page-section").forEach(s => s.classList.add("hidden"));
  document.getElementById(`page-${page}`).classList.remove("hidden");

  const menuItem = MENU_BY_ROLE[currentRole].find(i => i.page === page);
  document.getElementById("pageTitle").textContent = menuItem ? menuItem.label : "";
  document.getElementById("pageSub").textContent =
    page === "orders" ? ROLE_PAGE_SUB[currentRole]
    : page === "dashboard" ? (currentRole === "director" ? "Показатели компании" : "раздел в разработке")
    : (STATIC_PAGE_SUB[page] || "раздел в разработке");

  // кнопка создания заказа — только на "Заказы" и только у менеджера
  document.getElementById("createOrderBtn").classList.toggle(
    "hidden",
    !(page === "orders" && currentRole === "manager")
  );

  if (page === "orders") renderOrders();
  if (page === "designers") renderDesignersPage();
  if (page === "workers") renderWorkersPage();
  if (page === "staff") renderStaffPage();
  if (page === "archive") renderArchivePage();
  if (page === "materials-report") renderMaterialsReport();
  if (page === "finance") renderFinancePage();
  if (page === "production-plan") renderProductionPlan();
  if (page === "users") renderUsersPage();
  if (page === "proposals") renderProposalsPage();
  if (page === "chat") renderChatPage();
  if (page === "earnings") renderEarningsPage();
  if (page === "dashboard" && currentRole === "director") renderDashboardPage();
}

function nowLabel() {
  const months = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]}, ${hh}:${mm}`;
}

function canAttachFile(order) {
  if (currentRole === "manager" || currentRole === "director" || currentRole === "assistant") return true;
  if (currentRole === "designer") return order.status === "design" || order.status === "rework";
  if (currentRole === "worker") return order.status === "production";
  return false;
}
function fileIcon(type) {
const icons = { cdr: "CDR", psd: "PSD", pdf: "PDF", ai: "AI", tiff: "TIFF", zip: "ZIP" };
return icons[type.toLowerCase()] || "ФАЙЛ";
}

// защита от разметки в пользовательском вводе (название заказа, комментарий, чат и т.п.) — не применять к доверенным константам
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

function renderEmailBtn(order) {
  if (currentRole !== "manager" && currentRole !== "director" && currentRole !== "assistant") return "";
  if (!order.customerEmail) return "";
  const subject = encodeURIComponent(`Заказ #${order.id} — ${order.title}`);
  const body = encodeURIComponent(`Здравствуйте,\n\nПо заказу #${order.id} "${order.title}".\n\n`);
  return `<a class="btn btn-ghost btn-sm" href="mailto:${order.customerEmail}?subject=${subject}&body=${body}" title="Написать заказчику на ${order.customerEmail}">Написать заказчику</a>`;
}

// используется и в renderOrders(), и в doAction() — должна быть одна и та же функция, иначе индекс кнопки разъедется
function getAvailableActions(order, status) {
  return (TRANSITIONS[status] || [])
    .filter(a => a.role === currentRole)
    .filter(a => !a.requiresAccepted || order.acceptedBy != null);
}

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

// приоритет сверху вниз, первое совпадение выигрывает — цвет левой полоски карточки заказа
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
  else if (diff === 0) { cls += " ship-today"; label = `СЕГОДНЯ`; }
  else if (diff === 1) { cls += " ship-tomorrow"; label = `ЗАВТРА (${shipDate})`; }
  else if (diff <= 3) { cls += " ship-soon"; label = `${shipDate} (через ${diff} дн.)`; }

  return `<span class="${cls}">${label}</span>`;
}

function createdSortKey(order) {
  const first = order.history[0];
  if (!first) return 0;
  const match = first.when.match(/^(\d+)\s+([а-я]+)/i);
  if (!match) return 0;
  return MONTHS_ORDER.indexOf(match[2]) * 31 + Number(match[1]);
}

let currentFilter = "all";
let ordersSortFilter = "urgency";
function setFilter(f) {
  currentFilter = f;
  renderOrders();
}

// done-заказы сюда не попадают в любом случае — они в "Архиве" (renderArchivePage)
function applyFilterAndSort(allOrders) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const allowedStatuses = ROLE_ORDER_FILTER[currentRole];
  let result = (allowedStatuses ? allOrders.filter(o => allowedStatuses.includes(o.status)) : allOrders)
    .filter(o => o.status !== "done");

  // менеджер видит только заказы, которые создал сам — задел на будущее:
  // сейчас в STAFF один manager, поэтому пока видимо ничего не меняет.
  // Заработает по-настоящему при переходе на выбор конкретного сотрудника при входе, а не роли.
  if (currentRole === "manager") {
    const me = STAFF.find(s => s.role === "manager");
    result = result.filter(o => !o.createdBy || o.createdBy === me?.id);
  }

  if (currentFilter === "urgent") result = result.filter(o => o.urgent);
  if (currentFilter === "today") result = result.filter(o => {
    const d = parseShipDate(o.shipDate);
    return d && d.getTime() === today.getTime();
  });
  if (currentFilter === "overdue") result = result.filter(o => {
    const d = parseShipDate(o.shipDate);
    return d && d < today;
  });

  const sort = document.getElementById("sortSelect")?.value || ordersSortFilter;
  ordersSortFilter = sort;
  result.sort((a, b) => {
    if (sort === "status") return STATUSES.findIndex(s => s.key === a.status) - STATUSES.findIndex(s => s.key === b.status);
    if (sort === "created") return createdSortKey(b) - createdSortKey(a);
    if (sort === "urgency") {
      const scoreOf = o => {
        const d = parseShipDate(o.shipDate);
        return (!d || d < today) ? 3 : o.urgent ? 2 : 1;
      };
      const diff = scoreOf(b) - scoreOf(a);
      if (diff !== 0) return diff;
    }
    const da = parseShipDate(a.shipDate) || new Date(9999, 11, 31);
    const db = parseShipDate(b.shipDate) || new Date(9999, 11, 31);
    return da - db;
  });

  return result;
}

function renderOrders() {
  const list = document.getElementById("ordersList");
  const visibleOrders = applyFilterAndSort(orders);
  const urgentCount = visibleOrders.filter(o => o.urgent).length;
  const showFilters = currentRole === "manager" || currentRole === "director" || currentRole === "assistant";
  // done-заказы отфильтрованы из списка ниже, но просрочка чаще всего у них — поэтому сводка отдельно от карточек
  const showPaymentWarnings = ["manager", "director", "economist", "accountant"].includes(currentRole);

  list.innerHTML = (showPaymentWarnings ? renderPaymentWarnings() : "") + (showFilters ? `
    <div class="filter-bar">
      <div class="filter-chips">
        <button class="chip${currentFilter === "all" ? " active" : ""}" onclick="setFilter('all')">Все</button>
        <button class="chip${currentFilter === "urgent" ? " active" : ""}" onclick="setFilter('urgent')">Срочные</button>
        <button class="chip${currentFilter === "today" ? " active" : ""}" onclick="setFilter('today')">Сегодня</button>
        <button class="chip${currentFilter === "overdue" ? " active" : ""}" onclick="setFilter('overdue')">Просрочены</button>
      </div>
      <select id="sortSelect" onchange="renderOrders()" class="filter-sort">
        <option value="urgency" ${ordersSortFilter === "urgency" ? "selected" : ""}>По срочности</option>
        <option value="shipDate" ${ordersSortFilter === "shipDate" ? "selected" : ""}>По дате отгрузки</option>
        <option value="status" ${ordersSortFilter === "status" ? "selected" : ""}>По статусу</option>
        <option value="created" ${ordersSortFilter === "created" ? "selected" : ""}>По дате создания</option>
      </select>
    </div>
    <div class="orders-counter">${visibleOrders.length} заказов${urgentCount > 0 ? ` · <span style="color:var(--accent)">${urgentCount} срочных</span>` : ""}</div>
  ` : "");

  if (visibleOrders.length === 0) {
    list.innerHTML += `<span class="muted">Нет заказов, ожидающих вашего действия</span>`;
    return;
  }

  visibleOrders.forEach(order => {
    const status = getStatus(order.status);

    const historyHtml = order.history.map(ev => `
      <div class="history-item">
        <span class="dot"></span>
        <span>${escapeHtml(ev.text)}${ev.who ? ` · ${ev.who}` : ""}</span>
        <span class="when">${ev.when}</span>
      </div>
    `).join("");

    const actions = getAvailableActions(order, order.status);

    let actionsHtml;
    if (actions.length === 0) {
      actionsHtml = `<span class="muted">Ожидает действия другой роли</span>`;
    } else {
      actionsHtml = actions.map((a, i) => {
        const cls = a.primary
          ? (a.variant === "ok" ? "btn btn-ok" : "btn btn-primary")
          : "btn btn-ghost";
        // блокируется после принятия, снова активна при переназначении на другого (acceptedBy сбросится)
        const alreadyAccepted = a.accept && order.acceptedBy != null;
        const disabledAttr = alreadyAccepted ? " disabled" : "";
        const label = a.label;
        return `<button class="${cls}"${disabledAttr} onclick="doAction('${order.id}', '${order.status}', ${i})">${label}</button>`;
      }).join("");
    }

    const assigneeHtml = order.assignee
      ? `<span class="assignee">Исполнитель: ${staffName(order.assignee)}</span>`
      : "";

    const problemHtml = order.hasProblem
      ? `<span class="badge-problem" title="Есть проблема">Проблема</span>`
      : "";

    const urgentBadgeHtml = order.urgent
      ? `<span class="badge-urgent">Срочно</span>`
      : "";

    // бейдж типа скрыт для "обычного нового" — иначе он был бы на каждой карточке
    const typeLabel = ORDER_TYPES.find(t => t.key === order.orderType)?.label || "";
    const typeBadge = order.orderType && order.orderType !== "new"
      ? `<span class="badge-type">${typeLabel}</span>`
      : "";

    const cuttingLabel = {
      knife:     order.knifeId ? `Нож ${KNIVES.find(k => k.id === order.knifeId)?.name || ""}` : "Нож",
      laser:     "Лазер",
      new_knife: "Новый нож (+3 дн.)",
    }[order.cuttingType || "knife"] || "";

    // свёрнутый вид карточки показывает только тираж/материал/отгрузку/исполнителя —
    // остальные поля живут в разворачиваемом блоке "Детали" ниже (тот же паттерн, что и "История")
    const extraDetailsHtml = `
      <div class="order-details${order.detailsExpanded ? "" : " collapsed"}">
        <span class="detail">Размер: <strong>${order.labelSize || "—"}</strong></span>
        <span class="detail">Высечка: <strong>${cuttingLabel}</strong></span>
        <span class="detail">Ламинация: <strong>${order.lamination || "Нет"}</strong></span>
        <span class="detail">Машина: <strong>${order.machine || "—"}</strong></span>
      </div>
    `;

    // переиспользуем разметку истории (.history/.history-item), новых классов не заводим
    const materialsHtml = (order.materials && order.materials.length > 0) ? `
      <div class="history">
        <div class="history-head"><div class="history-title">Материалы</div></div>
        <div class="history-list">
          ${order.materials.map(m => `
            <div class="history-item">
              <span class="dot"></span>
              <span>${escapeHtml(m.name)} — ${escapeHtml(m.qty)} (${m.reason})</span>
              <span class="when">${m.date}</span>
            </div>
          `).join("")}
        </div>
      </div>
    ` : "";

    const filesHtml = (order.files && order.files.length > 0) ? `
      <div class="files-block">
        <div class="files-head"><span class="history-title">Файлы (${order.files.length})</span></div>
        ${order.files.map(f => `
          <div class="file-item">
            <span class="file-icon">${fileIcon(f.type)}</span>
            <span class="file-name">${escapeHtml(f.name)}</span>
            <span class="file-meta">${f.size} · ${f.addedBy} · ${f.addedAt}</span>
          </div>
        `).join("")}
      </div>
    ` : "";

    // не действие TRANSITIONS (не смена статуса), поэтому строится отдельно
    const urgentToggleHtml = (currentRole === "manager" || currentRole === "director" || currentRole === "assistant")
      ? `<button class="btn btn-ghost btn-sm" onclick="toggleUrgent('${order.id}')">${order.urgent ? "Снять срочность" : "Срочно"}</button>`
      : "";

    // кнопка "на доработку" — только если заказ реально вернули с проблемой
    const materialButtonsHtml = (currentRole === "manager" || currentRole === "director" || currentRole === "assistant") ? `
      <button class="btn btn-ghost btn-sm" onclick="openAddMaterialModal('${order.id}')">+ Материал</button>
      ${order.hasProblem ? `<button class="btn btn-ghost btn-sm" onclick="openAddMaterialModal('${order.id}', 'Доработка')">+ Материал на доработку</button>` : ""}
    ` : "";

    const fileButtonHtml = canAttachFile(order)
      ? `<button class="btn btn-ghost btn-sm" onclick="openFileModal('${order.id}')">+ Прикрепить файл</button>`
      : "";

    const pricingBtnHtml = ["manager", "economist", "director"].includes(currentRole)
      ? `<button class="btn btn-ghost btn-sm" onclick="openPricingModal('${order.id}')">Цена и себестоимость</button>`
      : "";

    const emailBtnHtml = renderEmailBtn(order);

    const card = document.createElement("div");
    card.id = `order-card-${order.id}`;
    card.className = "order-card";
    card.style.setProperty("--stripe-color", getStripeColor(order));
    card.innerHTML = `
      <div class="order-head">
        <span class="order-head-left">
          <span class="order-title">${escapeHtml(order.title)}</span>${typeBadge}
        </span>
        <span class="order-head-right">
          <span class="badge ${status.key}">${status.label}</span>${problemHtml}${urgentBadgeHtml}
        </span>
      </div>
      <div class="order-meta">
        <span>#${order.id} · ${escapeHtml(order.customer)} · ${(order.runLength || 0).toLocaleString()} шт.</span>
        ${renderPaidBadge(order)} ${renderPaymentAlert(order)}
      </div>
      <div class="order-line3">
        <span>${order.shipDate ? renderShipDate(order.shipDate) : "Отгрузка не задана"}</span>
        <span>${order.material || "—"}</span>
        ${assigneeHtml}
      </div>

      <div class="history">
        <div class="history-head history-head--toggle" onclick="toggleDetails('${order.id}')">
          <div class="history-title">Детали</div>
          <button class="history-toggle">${order.expanded ? "Свернуть" : "Развернуть"}</button>
        </div>
        ${extraDetailsHtml}
      </div>
      ${materialsHtml}

      <div class="history">
        <div class="history-head history-head--toggle" onclick="toggleHistory('${order.id}')">
          <div class="history-title">История</div>
          <button class="history-toggle">${order.expanded ? "▴" : "▾"}</button>
        </div>
        <div class="history-list${order.expanded ? "" : " collapsed"}">${historyHtml}</div>
      </div>

      ${filesHtml}

      <div class="order-actions">${actionsHtml}${urgentToggleHtml}${materialButtonsHtml}${fileButtonHtml}${pricingBtnHtml}${emailBtnHtml}</div>
    `;
    list.appendChild(card);
  });
}

// состояние живёт на order.expanded — раскрытие одной карточки не влияет на другие
function toggleHistory(orderId) {
  const order = orders.find(o => o.id === orderId);
  order.expanded = !order.expanded;
  renderOrders();
}

// состояние живёт на order.detailsExpanded — раскрытие деталей одной карточки не влияет на другие
function toggleDetails(orderId) {
  const order = orders.find(o => o.id === orderId);
  order.detailsExpanded = !order.detailsExpanded;
  renderOrders();
}

function renderPaidBadge(order) {
  // designer/worker/assistant не видят оплату вообще — не просто "нельзя нажать", значка нет совсем
  if (currentRole === "designer" || currentRole === "worker" || currentRole === "assistant") return "";

  const canTogglePaid = currentRole === "economist" || currentRole === "accountant";
  const cls = `badge-paid ${order.paid ? "paid" : "unpaid"}${canTogglePaid ? " badge-paid--clickable" : ""}`;
  const title = canTogglePaid ? "Нажмите чтобы изменить статус оплаты" : (order.paid ? "Оплачено" : "Не оплачено");
  const onclick = canTogglePaid ? ` onclick="togglePaid('${order.id}')"` : "";
  const label = order.paid ? "Оплачен" : "Не оплачен";
  return `<span class="${cls}" title="${title}"${onclick}>${label}</span>`;
}

// защита на клиенте, не только скрытие onclick — работает и при вызове функции напрямую
function togglePaid(orderId) {
  if (currentRole !== "economist" && currentRole !== "accountant") return;
  const order = orders.find(o => o.id === orderId);
  order.paid = !order.paid;
  renderOrders();
  renderArchivePage();
  // финансы могут быть открыты прямо сейчас — без этого бейдж не обновлялся до ухода со страницы
  if (document.getElementById("financeTable")) renderFinancePage();
}

// видят manager/director/economist/accountant — остальным про срок оплаты знать не нужно
function renderPaymentAlert(order) {
  if (!["manager", "director", "economist", "accountant"].includes(currentRole)) return "";
  if (!order.paymentDue || order.paid) return "";

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = parseShipDate(order.paymentDue);
  const diff = Math.round((due - today) / 86400000);

  if (diff < 0) return `<span class="payment-alert overdue">Просрочена оплата (${order.paymentDue})</span>`;
  if (diff === 0) return `<span class="payment-alert today">Оплата сегодня!</span>`;
  if (diff <= 3) return `<span class="payment-alert soon">Оплата через ${diff} дн. (${order.paymentDue})</span>`;
  return "";
}

function renderPaymentWarnings() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const warnings = orders.filter(o => {
    if (!o.paymentDue || o.paid) return false;
    const due = parseShipDate(o.paymentDue);
    return (due - today) / 86400000 <= 3;
  });
  if (!warnings.length) return "";

  return `<div class="payment-warnings">
    <div class="payment-warnings-title">Требуют внимания по оплате</div>
    ${warnings.map(o => {
      const due = parseShipDate(o.paymentDue);
      const diff = Math.round((due - today) / 86400000);
      const label = diff < 0 ? "просрочено" : diff === 0 ? "сегодня" : `через ${diff} дн.`;
      return `<div class="payment-warn-row">
        <span>${escapeHtml(o.title)} · ${escapeHtml(o.customer)}</span>
        <span class="${diff < 0 ? "overdue" : "soon"}">${label}</span>
      </div>`;
    }).join("")}
  </div>`;
}

// временная логика — точные правила ввода цены/себестоимости уточняются у заказчика
function openPricingModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  const canEditClientPrice = ["manager", "economist", "director"].includes(currentRole);
  const canEditCostPrice = ["economist", "director"].includes(currentRole);

  const marginPct = (order.clientPrice != null && order.costPrice != null && order.clientPrice !== 0)
    ? Math.round((order.clientPrice - order.costPrice) / order.clientPrice * 100)
    : null;
  const profitHtml = (order.clientPrice != null && order.costPrice != null) ? `
    <div class="pricing-profit">
      Прибыль: <strong>${(order.clientPrice - order.costPrice).toLocaleString()} ₽</strong>
      (${marginPct != null ? marginPct + "%" : "—"})
    </div>` : "";

  openModal(`
    <div class="modal-header"><h3>Цена и себестоимость — #${order.id}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Цена для клиента, ₽</label>
        <input type="number" id="modalClientPrice" value="${order.clientPrice ?? ""}" ${canEditClientPrice ? "" : "disabled"} placeholder="напр. 45000">
      </div>
      <div class="field">
        <label class="field-label">Себестоимость, ₽</label>
        <input type="number" id="modalCostPrice" value="${order.costPrice ?? ""}" ${canEditCostPrice ? "" : "disabled"} placeholder="напр. 28000">
      </div>
      ${profitHtml}
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="savePricing('${order.id}')">Сохранить</button>
    </div>
  `);
}

function savePricing(orderId) {
  const order = orders.find(o => o.id === orderId);
  const clientPriceEl = document.getElementById("modalClientPrice");
  const costPriceEl = document.getElementById("modalCostPrice");
  if (!clientPriceEl.disabled) {
    order.clientPrice = clientPriceEl.value ? Number(clientPriceEl.value) : null;
  }
  if (!costPriceEl.disabled) {
    order.costPrice = costPriceEl.value ? Number(costPriceEl.value) : null;
  }
  closeModal();
  renderOrders();
}

// id заказа, на который сейчас оформляется пометка "срочно" через модалку
let pendingUrgentOrderId = null;

function toggleUrgent(orderId) {
  if (currentRole !== "manager" && currentRole !== "director" && currentRole !== "assistant") return;
  const order = orders.find(o => o.id === orderId);

  // снятие срочности мгновенное, пометка новой — только через модалку с причиной
  if (order.urgent) {
    order.urgent = false;
    order.history.push({
      text: "Снята срочность",
      who: ROLE_LABELS[currentRole],
      when: nowLabel(),
    });
    renderOrders();
    return;
  }

  pendingUrgentOrderId = orderId;
  openModal(`
    <div class="modal-header"><h3>Отметить как срочный?</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Причина срочности (необязательно)</label>
        <textarea id="modalUrgentReason" rows="3" placeholder="Например: клиент просил ускорить"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="confirmUrgent()">Подтвердить</button>
    </div>
  `);
}

function confirmUrgent() {
  const order = orders.find(o => o.id === pendingUrgentOrderId);
  const reason = document.getElementById("modalUrgentReason").value.trim();
  order.urgent = true;
  order.history.push({
    text: "Отмечен как срочный" + (reason ? `: ${reason}` : ""),
    who: ROLE_LABELS[currentRole],
    when: nowLabel(),
  });
  pendingUrgentOrderId = null;
  closeModal();
  renderOrders();
}

// строковое сравнение "when" даёт неверный порядок (алфавит месяцев ≠ хронология), парсим день+месяц в число
const MONTHS_ORDER = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
function historySortKey(order) {
  const lastEvent = order.history[order.history.length - 1];
  if (!lastEvent) return 0;
  const match = lastEvent.when.match(/^(\d+)\s+([а-я]+)/i);
  if (!match) return 0;
  return MONTHS_ORDER.indexOf(match[2]) * 31 + Number(match[1]);
}

// фильтр по order.shipDate (реальный ISO YYYY-MM-DD), не по "when" истории — там нет года
let archiveFilterFrom = "";
let archiveFilterTo = "";

function setArchiveFilter(which, value) {
  if (which === "from") archiveFilterFrom = value; else archiveFilterTo = value;
  renderArchivePage();
}

function renderArchivePage() {
  const list = document.getElementById("archiveList");
  const filterHtml = `
    <div class="field" style="display:flex;gap:12px;align-items:flex-end;max-width:400px;margin-bottom:16px">
      <div style="flex:1">
        <label class="field-label">С даты</label>
        <input type="date" id="archiveFrom" value="${archiveFilterFrom}" onchange="setArchiveFilter('from', this.value)">
      </div>
      <div style="flex:1">
        <label class="field-label">По дату</label>
        <input type="date" id="archiveTo" value="${archiveFilterTo}" onchange="setArchiveFilter('to', this.value)">
      </div>
    </div>`;

  const allDone = orders.filter(o => o.status === "done");
  if (allDone.length === 0) {
    list.innerHTML = filterHtml + `<span class="muted">Архив пуст</span>`;
    return;
  }

  let doneOrders = allDone;
  if (archiveFilterFrom) doneOrders = doneOrders.filter(o => o.shipDate && o.shipDate >= archiveFilterFrom);
  if (archiveFilterTo) doneOrders = doneOrders.filter(o => o.shipDate && o.shipDate <= archiveFilterTo);
  doneOrders = doneOrders.sort((a, b) => historySortKey(b) - historySortKey(a));

  if (doneOrders.length === 0) {
    list.innerHTML = filterHtml + `<span class="muted">Нет заказов за выбранный период</span>`;
    return;
  }

  const rows = doneOrders.map(order => {
    const lastEvent = order.history[order.history.length - 1];
    const isUnpaidDone = order.status === "done" && !order.paid;
    const rowClass = isUnpaidDone ? ' class="row-unpaid"' : "";

    const historyHtml = order.history.map(ev => `
      <div class="history-item">
        <span class="dot"></span>
        <span>${escapeHtml(ev.text)}${ev.who ? " · " + ev.who : ""}</span>
        <span class="when">${ev.when}</span>
      </div>
    `).join("");

    return `
      <tr${rowClass}>
        <td data-label="№">#${order.id}</td>
        <td data-label="Заказчик">${escapeHtml(order.customer) || "—"}</td>
        <td data-label="Наименование">${escapeHtml(order.title)}</  
        <td><button class="btn btn-ghost btn-sm" onclick="toggleArchiveHistory('${order.id}', this)">▾ история</button></td>
      </tr>
      <tr class="hidden" id="archive-hist-${order.id}">
        <td colspan="8"><div class="history-list">${historyHtml}</div></td>
      </tr>
    `;
  }).join("");

  list.innerHTML = filterHtml + `
    <table class="report-table">
      <thead>
        <tr>
          <th>№</th><th>Заказчик</th><th>Наименование</th><th>Тираж</th>
          <th>Машина</th><th>Завершён</th><th>Оплата</th><th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// DOM-переключатель, не order.expanded — тому полю тут нет необходимости, состояние в разметке
function toggleArchiveHistory(orderId, btn) {
  const el = document.getElementById("archive-hist-" + orderId);
  el.classList.toggle("hidden");
  btn.textContent = el.classList.contains("hidden") ? "Развернуть историю" : "Свернуть историю";
}

// использование материалов в заказах — общая часть, видна всем ролям с доступом к странице
function renderMaterialsUsageTable() {
  const grouped = {};
  orders.forEach(order => {
    if (!grouped[order.material]) {
      grouped[order.material] = { active: 0, done: 0, totalRun: 0 };
    }
    grouped[order.material].totalRun += order.runLength || 0;
    if (order.status === "done") grouped[order.material].done++;
    else grouped[order.material].active++;
  });

  const rows = Object.entries(grouped).map(([mat, data]) => `
    <tr>
      <td>${mat || "—"}</td>
      <td>${data.active + data.done}</td>
      <td>${data.active}</td>
      <td>${data.done}</td>
      <td>${data.totalRun.toLocaleString()} шт.</td>
    </tr>
  `).join("");

  return `
    <table class="report-table">
      <thead>
        <tr>
          <th>Материал</th><th>Всего заказов</th>
          <th>Активных</th><th>Завершённых</th><th>Суммарный тираж</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="5" class="muted">Нет данных</td></tr>'}</tbody>
    </table>
  `;
}

function stockByKind(kind) {
  return kind === "ink" ? INK_STOCK : MATERIAL_STOCK;
}

// read-only строки для отчёта по затратам — без кнопок редактирования/удаления, в отличие от renderStockTable()
function costReportStockRows(kind) {
  const entries = Object.entries(stockByKind(kind));
  const rows = entries.map(([name, d]) => `
    <tr>
      <td>${escapeHtml(name)}</td><td>${d.qty}</td><td>${d.unit}</td>
      <td>${d.price.toLocaleString()} ₽</td><td>${(d.qty * d.price).toLocaleString()} ₽</td>
    </tr>
  `).join("");
  const total = entries.reduce((s, [, d]) => s + d.qty * d.price, 0);
  return { rows: rows || `<tr><td colspan="5" class="muted">Нет данных</td></tr>`, total };
}

// order.materials[] — списания внутри заказа, группировка по названию материала (не путать с
// renderMaterialsUsageTable(), которая группирует по order.material — общему материалу заказа)
function groupMaterialWriteOffs() {
  const grouped = {};
  orders.forEach(order => (order.materials || []).forEach(m => {
    (grouped[m.name] ??= []).push({ qty: m.qty, reason: m.reason, orderId: order.id });
  }));
  return grouped;
}

function renderMaterialWriteOffsHtml() {
  const grouped = groupMaterialWriteOffs();
  const names = Object.keys(grouped).sort();
  if (!names.length) return `<span class="muted">Списаний не было</span>`;
  return names.map(name => `
    <div class="history-title" style="margin-top:var(--sp-3)">${escapeHtml(name)}</div>
    <div class="history-list">
      ${grouped[name].map(e => `
        <div class="history-item">
          <span class="dot"></span>
          <span>${escapeHtml(e.qty)} (${e.reason}) — заказ #${e.orderId}</span>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function openCostReportModal() {
  const materialsData = costReportStockRows("material");
  const inksData = costReportStockRows("ink");
  const grandTotal = materialsData.total + inksData.total;

  openModal(`
    <div class="modal-header"><h3>Отчёт по затратам</h3></div>
    <div class="modal-body">
      <div class="history-title">Материалы на складе</div>
      <table class="report-table">
        <thead><tr><th>Материал</th><th>Остаток</th><th>Ед.</th><th>Цена за ед.</th><th>Итого</th></tr></thead>
        <tbody>${materialsData.rows}</tbody>
        <tfoot><tr class="finance-total"><td colspan="4"><strong>Итого материалы</strong></td><td>${materialsData.total.toLocaleString()} ₽</td></tr></tfoot>
      </table>

      <div class="history-title" style="margin-top:var(--sp-5)">Краски и лаки</div>
      <table class="report-table">
        <thead><tr><th>Краска</th><th>Остаток</th><th>Ед.</th><th>Цена за ед.</th><th>Итого</th></tr></thead>
        <tbody>${inksData.rows}</tbody>
        <tfoot><tr class="finance-total"><td colspan="4"><strong>Итого краски</strong></td><td>${inksData.total.toLocaleString()} ₽</td></tr></tfoot>
      </table>

      <div class="history-title" style="margin-top:var(--sp-5)">Списания по заказам</div>
      ${renderMaterialWriteOffsHtml()}

      <div class="finance-total" style="margin-top:var(--sp-5);padding:14px var(--sp-4);background:var(--surface-2);border-radius:var(--r-md);font-weight:700">
        Итого стоимость склада: ${grandTotal.toLocaleString()} ₽
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Закрыть</button>
      <button class="btn btn-primary" onclick="copyCostReport()">Скопировать отчёт</button>
    </div>
  `);
}

function buildCostReportText() {
  const lines = ["Отчёт по затратам", ""];

  lines.push("Материалы на складе:");
  const materialsEntries = Object.entries(MATERIAL_STOCK);
  materialsEntries.forEach(([name, d]) => {
    lines.push(`  ${name}: ${d.qty} ${d.unit} × ${d.price} ₽ = ${(d.qty * d.price).toLocaleString()} ₽`);
  });
  const materialsTotal = materialsEntries.reduce((s, [, d]) => s + d.qty * d.price, 0);
  lines.push(`  Итого материалы: ${materialsTotal.toLocaleString()} ₽`, "");

  lines.push("Краски и лаки:");
  const inksEntries = Object.entries(INK_STOCK);
  inksEntries.forEach(([name, d]) => {
    lines.push(`  ${name}: ${d.qty} ${d.unit} × ${d.price} ₽ = ${(d.qty * d.price).toLocaleString()} ₽`);
  });
  const inksTotal = inksEntries.reduce((s, [, d]) => s + d.qty * d.price, 0);
  lines.push(`  Итого краски: ${inksTotal.toLocaleString()} ₽`, "");

  lines.push("Списания по заказам:");
  const grouped = groupMaterialWriteOffs();
  const names = Object.keys(grouped).sort();
  if (!names.length) {
    lines.push("  Списаний не было");
  } else {
    names.forEach(name => {
      lines.push(`  ${name}:`);
      grouped[name].forEach(e => lines.push(`    ${e.qty} (${e.reason}) — заказ #${e.orderId}`));
    });
  }
  lines.push("");

  lines.push(`Итого стоимость склада: ${(materialsTotal + inksTotal).toLocaleString()} ₽`);
  return lines.join("\n");
}

function copyCostReport() {
  navigator.clipboard.writeText(buildCostReportText())
    .then(() => showNotify("Отчёт скопирован в буфер обмена"))
    .catch(() => showNotify("Не удалось скопировать отчёт"));
}

// showCost — только для director (колонка "Стоимость запаса")
function renderStockTable(kind, label, showCost) {
  const stock = stockByKind(kind);
  const rows = Object.entries(stock).map(([name, data]) => `
    <tr>
      <td>${name}</td>
      <td>${data.qty}</td>
      <td>${data.unit}</td>
      <td>${data.price.toLocaleString()} ₽</td>
      ${showCost ? `<td>${(data.qty * data.price).toLocaleString()} ₽</td>` : ""}
      <td>
        <button class="btn btn-ghost btn-sm" onclick="openEditPriceModal('${name}', '${kind}')">Изменить цену</button>
        <button class="btn btn-ghost btn-sm" onclick="openDeleteStockModal('${name}', '${kind}')">Удалить</button>
      </td>
    </tr>
  `).join("");

  const colspan = showCost ? 6 : 5;
  return `
    <div class="history-title" style="margin:var(--sp-5) 0 8px">${label}</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>Материал</th><th>Остаток</th><th>Ед.</th><th>Цена за ед.</th>
          ${showCost ? "<th>Стоимость запаса</th>" : ""}
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>${rows || `<tr><td colspan="${colspan}" class="muted">Нет данных</td></tr>`}</tbody>
    </table>
  `;
}

let pendingDeleteStockItem = null;

function openDeleteStockModal(name, kind) {
  pendingDeleteStockItem = { name, kind };
  openModal(`
    <div class="modal-header"><h3>Удалить позицию?</h3></div>
    <div class="modal-body"><p>«${name}» будет удалена со склада.</p></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="confirmDeleteStock()">Удалить</button>
    </div>
  `);
}

function confirmDeleteStock() {
  const { name, kind } = pendingDeleteStockItem;
  delete stockByKind(kind)[name];
  pendingDeleteStockItem = null;
  closeModal();
  renderMaterialsReport();
}

function renderMaterialsReport() {
  const container = document.getElementById("materialsReportList");

  // менеджер/бухгалтер видят только использование — у экономиста/admin/директора управление складом
  if (!["economist", "admin", "director"].includes(currentRole)) {
    container.innerHTML = renderMaterialsUsageTable();
    return;
  }

  const showCost = currentRole === "director";
  let totalHtml = "";
  if (showCost) {
    const materialsTotal = Object.values(MATERIAL_STOCK).reduce((sum, m) => sum + m.qty * m.price, 0);
    const inksTotal = Object.values(INK_STOCK).reduce((sum, m) => sum + m.qty * m.price, 0);
    totalHtml = `<div class="finance-total" style="padding:14px var(--sp-4);background:var(--surface-2);border-radius:var(--r-md);margin-bottom:var(--sp-4);font-weight:700">
      Итоговая стоимость запасов: ${(materialsTotal + inksTotal).toLocaleString()} ₽
    </div>`;
  }

  container.innerHTML = `
    <div class="history-title">Управление материалами</div>
    <div style="display:flex;gap:8px;margin:12px 0 var(--sp-4)">
      <button class="btn btn-primary btn-sm" onclick="openAddMaterialToStockModal()">+ Добавить материал</button>
      <button class="btn btn-primary btn-sm" onclick="openAddInkToStockModal()">+ Добавить краску</button>
    </div>
    ${totalHtml}
    ${renderStockTable("material", "Материалы на складе", showCost)}
    ${renderStockTable("ink", "Краски и лаки", showCost)}
    <div class="history-title" style="margin:var(--sp-5) 0 8px">Использование в заказах</div>
    ${renderMaterialsUsageTable()}
  `;
}

// общий шаг для материала и краски: сначала спрашиваем "из справочника или новый"
function openAddStockTypeChoiceModal(kind) {
  const label = kind === "ink" ? "краску" : "материал";
  openModal(`
    <div class="modal-header"><h3>Добавить ${label}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">${kind === "ink" ? "Краска" : "Материал"} уже есть в справочнике или новый?</label>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" style="flex:1" onclick="openAddStockExistingModal('${kind}')">Выбрать из списка</button>
          <button class="btn btn-ghost" style="flex:1" onclick="openAddStockNewModal('${kind}')">Новый ${label}</button>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost btn-full" onclick="closeModal()">Отмена</button>
    </div>
  `);
}

function openAddMaterialToStockModal() { openAddStockTypeChoiceModal("material"); }
function openAddInkToStockModal() { openAddStockTypeChoiceModal("ink"); }

// количество/единица/цена — общий хвост формы что для существующей, что для новой позиции
function stockFieldsHtml() {
  return `
    <div class="field">
      <label class="field-label">Количество</label>
      <input type="number" id="modalStockQty" min="0" step="1" placeholder="10">
    </div>
    <div class="field">
      <label class="field-label">Единица</label>
      <select id="modalStockUnit">
        <option value="рулон">рулон</option>
        <option value="кг">кг</option>
        <option value="м²">м²</option>
      </select>
    </div>
    <div class="field">
      <label class="field-label">Цена за единицу, ₽</label>
      <input type="number" id="modalStockPrice" min="0" step="1" placeholder="4200">
    </div>
  `;
}

function openAddStockExistingModal(kind) {
  const catalog = kind === "ink" ? INKS : MATERIALS;
  const stock = stockByKind(kind);
  const available = catalog.filter(name => !(name in stock));
  openModal(`
    <div class="modal-header"><h3>${kind === "ink" ? "Добавить краску" : "Добавить материал"} — из списка</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Название</label>
        <select id="modalStockName"></select>
      </div>
      ${stockFieldsHtml()}
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitAddStockExisting('${kind}')">Сохранить</button>
    </div>
  `);
  fillSelect("modalStockName", available.length ? available : ["— все уже на складе —"]);
}

function submitAddStockExisting(kind) {
  const name = document.getElementById("modalStockName").value;
  if (!name || name.startsWith("—")) {
    showNotify("Нет доступных позиций для добавления — все уже на складе");
    return;
  }
  saveStockEntry(kind, name);
}

function openAddStockNewModal(kind) {
  openModal(`
    <div class="modal-header"><h3>${kind === "ink" ? "Новая краска" : "Новый материал"}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Название</label>
        <input type="text" id="modalStockNewName" placeholder="${kind === "ink" ? "Например, Лак матовый хим. стойкий" : "Например, Пленка PP чёрная"}">
      </div>
      ${stockFieldsHtml()}
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitAddStockNew('${kind}')">Сохранить</button>
    </div>
  `);
}

function submitAddStockNew(kind) {
  const name = document.getElementById("modalStockNewName").value.trim();
  if (!name) {
    showNotify("Укажите название");
    return;
  }
  // новая позиция автоматически попадает и в справочник (MATERIALS/INKS), не только в склад
  const catalog = kind === "ink" ? INKS : MATERIALS;
  if (!catalog.includes(name)) catalog.push(name);
  saveStockEntry(kind, name);
}

function saveStockEntry(kind, name) {
  const qty = Number(document.getElementById("modalStockQty").value) || 0;
  const unit = document.getElementById("modalStockUnit").value;
  const price = Number(document.getElementById("modalStockPrice").value) || 0;
  stockByKind(kind)[name] = { qty, unit, price };
  closeModal();
  renderMaterialsReport();
}

let pendingEditPriceItem = null;

function openEditPriceModal(name, kind) {
  const item = stockByKind(kind)[name];
  if (!item) return;
  pendingEditPriceItem = { name, kind };
  openModal(`
    <div class="modal-header"><h3>Изменить цену — ${name}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Новая цена за единицу, ₽</label>
        <input type="number" id="modalNewPrice" min="0" step="1" value="${item.price}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitEditPrice()">Сохранить</button>
    </div>
  `);
}

function submitEditPrice() {
  const { name, kind } = pendingEditPriceItem;
  const price = Number(document.getElementById("modalNewPrice").value) || 0;
  stockByKind(kind)[name].price = price;
  pendingEditPriceItem = null;
  closeModal();
  renderMaterialsReport();
}

// клик по неоплаченному заказу (economist/accountant) переносит на карточку в "Заказы",
// вместо обычного открытия модалки материалов
function jumpToOrder(orderId) {
  // done отфильтрован из "Заказы" — карточки там нет, переход бессмыслен, показываем модалку
  const order = orders.find(o => o.id === orderId);
  if (order.status === "done") {
    openOrderMaterialsModal(orderId);
    return;
  }

  goto("orders");
  setTimeout(() => {
    const card = document.getElementById(`order-card-${orderId}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("order-card--highlight");
      setTimeout(() => card.classList.remove("order-card--highlight"), 2000);
    }
  }, 50);
}

let financeFilter = "all";

function setFinanceFilter(f) {
  financeFilter = f;
  renderFinanceTable();
}

function renderFinancePage() {
  const container = document.getElementById("financeTable");
  const canViewCostReport = currentRole === "accountant" || currentRole === "director";
  container.innerHTML = `
    <div class="filter-bar">
      <div class="filter-chips">
        <button class="chip${financeFilter === "all" ? " active" : ""}" onclick="setFinanceFilter('all')">Все</button>
        <button class="chip${financeFilter === "unpaid" ? " active" : ""}" onclick="setFinanceFilter('unpaid')">Не оплачены</button>
        <button class="chip${financeFilter === "today" ? " active" : ""}" onclick="setFinanceFilter('today')">Сегодня</button>
        <button class="chip${financeFilter === "overdue" ? " active" : ""}" onclick="setFinanceFilter('overdue')">Просрочены</button>
      </div>
      ${canViewCostReport ? `<button class="btn btn-primary btn-sm" onclick="openCostReportModal()">Отчёт по затратам</button>` : ""}
    </div>
    <div id="financeTableBody"></div>
  `;
  renderFinanceTable();
}

// перерисовывает только таблицу — чипы и обёртку renderFinancePage() не трогает
function renderFinanceTable() {
  const body = document.getElementById("financeTableBody");
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const filteredOrders = orders.filter(order => {
    if (financeFilter === "all") return true;
    if (financeFilter === "unpaid") return !order.paid;
    if (order.paid || !order.paymentDue) return false;
    const diff = Math.round((parseShipDate(order.paymentDue) - today) / 86400000);
    return financeFilter === "today" ? diff === 0 : diff < 0; // overdue
  });

  const rows = filteredOrders.map(order => {
    const status = getStatus(order.status);
    const unpaidDone = order.status === "done" && !order.paid;
    const rowClass = unpaidDone ? ' class="row-unpaid"' : "";
    const canJump = !order.paid && (currentRole === "economist" || currentRole === "accountant");
    const rowClick = canJump ? `jumpToOrder('${order.id}')` : `openOrderMaterialsModal('${order.id}')`;
    return `<tr${rowClass} style="cursor:pointer" onclick="if (!event.target.closest('.badge-paid') && !event.target.closest('.status-badge-wrap')) ${rowClick}">
      <td data-label="№">#${order.id}</td>
      <td data-label="Заказчик">${escapeHtml(order.customer) || "—"}</td>
      <td data-label="Наименование">${escapeHtml(order.title)}</td>
      <td data-label="Тираж">${(order.runLength || 0).toLocaleString()} шт.</td>
      <td data-label="Машина">${order.machine || "—"}</td>
      <td data-label="Отгрузка">${order.shipDate || "—"}</td>
      <td data-label="Статус"><span class="status-badge-wrap" style="position:relative;display:inline-block" onclick="toggleStatusTip(event, '${status.key}')"><span class="badge ${status.key}">${status.label}</span></span></td>
      <td data-label="Оплата">${renderPaidBadge(order)}</td><td>${renderPaidBadge(order)}</td>
    </tr>`;
  }).join("");

  // итог/оплачено/ожидает — по всем заказам, не по фильтру, чтобы сводка не "плавала" при переключении чипов
  const total = orders.length;
  const paidCount = orders.filter(o => o.paid).length;

  body.innerHTML = `
    ${renderPaymentWarnings()}
    <table class="report-table">
      <thead>
        <tr>
          <th>№</th><th>Заказчик</th><th>Наименование</th>
          <th>Тираж</th><th>Машина</th><th>Отгрузка</th>
          <th>Статус</th><th>Оплата</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="8" class="muted">Нет заказов по фильтру</td></tr>'}</tbody>
      <tfoot>
        <tr class="finance-total">
          <td colspan="3"><strong>Итого: ${total} заказов</strong></td>
          <td colspan="3"></td>
          <td colspan="2"> Оплачено: ${paidCount} / Ожидает: ${total - paidCount}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

let earningsPeriodFilter = "all";

// clientPrice/costPrice — временная ручная логика (см. комментарий в задаче), точные правила
// ввода и источник себестоимости уточняются у заказчика; здесь просто считаем что задано
function renderEarningsPage() {
  
  const container = document.getElementById("earningsList");

  const period = document.getElementById("earningsPeriod")?.value || earningsPeriodFilter;
  earningsPeriodFilter = period;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const curMonth = today.getMonth(), curYear = today.getFullYear();
  const prevRef = new Date(curYear, curMonth - 1, 1);
  const prevMonth = prevRef.getMonth(), prevYear = prevRef.getFullYear();

  let filteredOrders = orders;
  if (period === "current" || period === "last") {
    const targetMonth = period === "current" ? curMonth : prevMonth;
    const targetYear = period === "current" ? curYear : prevYear;
    filteredOrders = orders.filter(o => {
      const d = parseShipDate(o.shipDate);
      return d && d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });
  }

  const withPricing = filteredOrders.filter(o => o.clientPrice != null && o.costPrice != null);
  const totalRevenue = withPricing.reduce((sum, o) => sum + o.clientPrice, 0);
  const totalCost = withPricing.reduce((sum, o) => sum + o.costPrice, 0);
  const totalProfit = totalRevenue - totalCost;
  // clientPrice === 0 исключён отдельно — иначе Infinity/NaN от деления на ноль портит общее среднее
  const withMargin = withPricing.filter(o => o.clientPrice !== 0);
  const avgMargin = withMargin.length
    ? Math.round(withMargin.reduce((sum, o) => sum + (o.clientPrice - o.costPrice) / o.clientPrice * 100, 0) / withMargin.length)
    : 0;

  const summaryHtml = `
    <div class="earnings-summary">
      <div class="earnings-tile">
        <div class="earnings-tile-label">Выручка</div>
        <div class="earnings-tile-value">${totalRevenue.toLocaleString()} ₽</div>
      </div>
      <div class="earnings-tile">
        <div class="earnings-tile-label">Себестоимость</div>
        <div class="earnings-tile-value">${totalCost.toLocaleString()} ₽</div>
      </div>
      <div class="earnings-tile">
        <div class="earnings-tile-label">Прибыль</div>
        <div class="earnings-tile-value ${totalProfit >= 0 ? "positive" : "negative"}">${totalProfit.toLocaleString()} ₽</div>
      </div>
      <div class="earnings-tile">
        <div class="earnings-tile-label">Средняя маржа</div>
        <div class="earnings-tile-value">${avgMargin}%</div>
      </div>
    </div>
  `;

  // те же права, что у кнопки "Цена и себестоимость" в renderOrders() — done тоже доступен, это модалка, не переход
  const canEditPricing = ["manager", "economist", "director"].includes(currentRole);

  const rows = filteredOrders.map(o => {
    const hasPricing = o.clientPrice != null && o.costPrice != null;
    const profit = hasPricing ? o.clientPrice - o.costPrice : null;
    const margin = hasPricing && o.clientPrice !== 0 ? Math.round(profit / o.clientPrice * 100) : null;
    const status = getStatus(o.status);
    const pricingCellHtml = canEditPricing
      ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); openPricingModal('${o.id}')">Цена</button>`
      : "";
    return `
      <tr onclick="jumpToOrder('${o.id}')" style="cursor:pointer">
        <td>#${o.id}</td>
        <td>${escapeHtml(o.customer) || "—"}</td>
        <td>${escapeHtml(o.title)}</td>
        <td><span class="badge ${status.key}">${status.label}</span></td>
        <td>${o.clientPrice != null ? o.clientPrice.toLocaleString() + " ₽" : "—"}</td>
        <td>${o.costPrice != null ? o.costPrice.toLocaleString() + " ₽" : "—"}</td>
        <td class="${profit != null ? (profit >= 0 ? "profit-pos" : "profit-neg") : ""}">${profit != null ? profit.toLocaleString() + " ₽" : "—"}</td>
        <td>${margin != null ? margin + "%" : "—"}</td>
        <td>${pricingCellHtml}</td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:var(--sp-4)">
      <select id="earningsPeriod" class="filter-sort" onchange="renderEarningsPage()">
        <option value="all" ${period === "all" ? "selected" : ""}>Все заказы</option>
        <option value="current" ${period === "current" ? "selected" : ""}>Текущий месяц</option>
        <option value="last" ${period === "last" ? "selected" : ""}>Прошлый месяц</option>
      </select>
    </div>
    ${summaryHtml}
    <table class="report-table">
      <thead>
        <tr>
          <th>№</th><th>Заказчик</th><th>Наименование</th><th>Статус</th>
          <th>Цена клиенту</th><th>Себестоимость</th><th>Прибыль</th><th>Маржа</th><th></th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="9" class="muted">Нет заказов за период</td></tr>'}</tbody>
    </table>
  `;
}

let dashboardPeriod = "current";   // current | last | all
let dashboardCustomer = "all";
let dashboardMaterial = "all";

// applyPeriod=false — для блоков, где период по смыслу не применим ("выручка по месяцам", "загрузка станков")
function dashboardFilteredOrders(applyPeriod) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const curMonth = today.getMonth(), curYear = today.getFullYear();
  const prevRef = new Date(curYear, curMonth - 1, 1);
  const prevMonth = prevRef.getMonth(), prevYear = prevRef.getFullYear();

  return orders.filter(o => {
    if (dashboardCustomer !== "all" && o.customer !== dashboardCustomer) return false;
    if (dashboardMaterial !== "all" && o.material !== dashboardMaterial) return false;
    if (applyPeriod && dashboardPeriod !== "all") {
      const d = parseShipDate(o.shipDate);
      if (!d) return false;
      const targetMonth = dashboardPeriod === "current" ? curMonth : prevMonth;
      const targetYear = dashboardPeriod === "current" ? curYear : prevYear;
      if (d.getMonth() !== targetMonth || d.getFullYear() !== targetYear) return false;
    }
    return true;
  });
}

function renderDashboardKpiHtml() {
  const filtered = dashboardFilteredOrders(true);
  const revenue = filtered.filter(o => o.clientPrice != null).reduce((s, o) => s + o.clientPrice, 0);
  const activeCount = filtered.filter(o => o.status !== "done").length;
  const doneCount = filtered.filter(o => o.status === "done").length;
  const debtOrders = filtered.filter(o => o.status === "done" && !o.paid);
  const debtSum = debtOrders.filter(o => o.clientPrice != null).reduce((s, o) => s + o.clientPrice, 0);

  return `
    <div class="earnings-summary">
      <div class="earnings-tile">
        <div class="earnings-tile-label">Выручка за период</div>
        <div class="earnings-tile-value">${revenue.toLocaleString()} ₽</div>
      </div>
      <div class="earnings-tile">
        <div class="earnings-tile-label">Активных заказов</div>
        <div class="earnings-tile-value">${activeCount}</div>
      </div>
      <div class="earnings-tile">
        <div class="earnings-tile-label">Завершено за период</div>
        <div class="earnings-tile-value">${doneCount}</div>
      </div>
      <div class="earnings-tile">
        <div class="earnings-tile-label">Долги по оплате</div>
        <div class="earnings-tile-value">${debtOrders.length} · ${debtSum.toLocaleString()} ₽</div>
      </div>
    </div>
  `;
}

const MONTH_NAMES_FULL = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

function renderDashboardRevenueByMonthHtml() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const doneFiltered = orders.filter(o => {
    if (o.status !== "done") return false;
    if (dashboardCustomer !== "all" && o.customer !== dashboardCustomer) return false;
    if (dashboardMaterial !== "all" && o.material !== dashboardMaterial) return false;
    return true;
  });

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const ref = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({ year: ref.getFullYear(), month: ref.getMonth() });
  }

  const rows = months.map(({ year, month }) => {
    const inMonth = doneFiltered.filter(o => {
      const d = parseShipDate(o.shipDate);
      return d && d.getMonth() === month && d.getFullYear() === year;
    });
    const count = inMonth.length;
    const revenue = inMonth.reduce((s, o) => s + (o.clientPrice || 0), 0);
    const cost = inMonth.reduce((s, o) => s + (o.costPrice || 0), 0);
    const label = `${MONTH_NAMES_FULL[month]} ${year}`;
    if (count === 0) {
      return `<tr><td>${label}</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>`;
    }
    return `<tr>
      <td>${label}</td><td>${count}</td>
      <td>${revenue.toLocaleString()} ₽</td><td>${cost.toLocaleString()} ₽</td>
      <td>${(revenue - cost).toLocaleString()} ₽</td>
    </tr>`;
  }).join("");

  return `
    <table class="report-table">
      <thead><tr><th>Месяц</th><th>Завершено</th><th>Выручка</th><th>Себестоимость</th><th>Прибыль</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderDashboardMachineLoadHtml() {
  const active = orders.filter(o => {
    if (o.status === "done") return false;
    if (dashboardCustomer !== "all" && o.customer !== dashboardCustomer) return false;
    if (dashboardMaterial !== "all" && o.material !== dashboardMaterial) return false;
    return true;
  });

  const rows = MACHINES.map(machine => {
    const onMachine = active.filter(o => (o.machine || "Не назначена") === machine);
    const runLength = onMachine.reduce((s, o) => s + (o.runLength || 0), 0);
    return `<tr><td>${machine}</td><td>${onMachine.length}</td><td>${runLength.toLocaleString()} шт.</td></tr>`;
  }).join("");

  return `
    <table class="report-table">
      <thead><tr><th>Станок</th><th>Активных заказов</th><th>Суммарный тираж</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderDashboardTopClientsHtml() {
  const filtered = dashboardFilteredOrders(true);
  const byCustomer = {};
  filtered.forEach(o => {
    if (!o.customer) return;
    if (!byCustomer[o.customer]) byCustomer[o.customer] = { customer: o.customer, count: 0, runLength: 0, revenue: 0 };
    byCustomer[o.customer].count++;
    byCustomer[o.customer].runLength += o.runLength || 0;
    byCustomer[o.customer].revenue += o.clientPrice || 0;
  });

  const top = Object.values(byCustomer).sort((a, b) => b.runLength - a.runLength).slice(0, 5);
  const rows = top.map(c => `
    <tr>
      <td>${escapeHtml(c.customer)}</td><td>${c.count}</td>
      <td>${c.runLength.toLocaleString()} шт.</td><td>${c.revenue.toLocaleString()} ₽</td>
    </tr>
  `).join("");

  return `
    <table class="report-table">
      <thead><tr><th>Заказчик</th><th>Заказов</th><th>Суммарный тираж</th><th>Выручка</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4" class="muted">Нет данных</td></tr>'}</tbody>
    </table>
  `;
}

function renderDashboardPage() {
  const container = document.getElementById("page-dashboard");

  dashboardPeriod = document.getElementById("dashboardPeriod")?.value || dashboardPeriod;
  dashboardCustomer = document.getElementById("dashboardCustomer")?.value || dashboardCustomer;
  dashboardMaterial = document.getElementById("dashboardMaterial")?.value || dashboardMaterial;

  const uniqueCustomers = [...new Set(orders.map(o => o.customer).filter(Boolean))].sort();
  const uniqueMaterials = [...new Set(orders.map(o => o.material).filter(Boolean))].sort();

  container.innerHTML = `
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:var(--sp-4)">
      <select id="dashboardPeriod" class="filter-sort" onchange="renderDashboardPage()">
        <option value="current" ${dashboardPeriod === "current" ? "selected" : ""}>Текущий месяц</option>
        <option value="last" ${dashboardPeriod === "last" ? "selected" : ""}>Прошлый месяц</option>
        <option value="all" ${dashboardPeriod === "all" ? "selected" : ""}>Всё время</option>
      </select>
      <select id="dashboardCustomer" class="filter-sort" onchange="renderDashboardPage()">
        <option value="all" ${dashboardCustomer === "all" ? "selected" : ""}>Заказчик: все</option>
        ${uniqueCustomers.map(c => `<option value="${escapeHtml(c)}" ${dashboardCustomer === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
      </select>
      <select id="dashboardMaterial" class="filter-sort" onchange="renderDashboardPage()">
        <option value="all" ${dashboardMaterial === "all" ? "selected" : ""}>Материал: все</option>
        ${uniqueMaterials.map(m => `<option value="${escapeHtml(m)}" ${dashboardMaterial === m ? "selected" : ""}>${escapeHtml(m)}</option>`).join("")}
      </select>
    </div>

    ${renderDashboardKpiHtml()}

    <div class="history-title" style="margin:var(--sp-5) 0 8px">Выручка по месяцам</div>
    ${renderDashboardRevenueByMonthHtml()}

    <div class="history-title" style="margin:var(--sp-5) 0 8px">Загрузка станков</div>
    ${renderDashboardMachineLoadHtml()}

    <div class="history-title" style="margin:var(--sp-5) 0 8px">Топ-5 клиентов</div>
    ${renderDashboardTopClientsHtml()}
  `;
}

function renderProductionPlan() {
  const container = document.getElementById("productionPlanList");
  const planOrders = orders
    .filter(o => ["approval", "production"].includes(o.status))
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  if (planOrders.length === 0) {
    container.innerHTML = `<span class="muted">Нет заказов в производстве</span>`;
    return;
  }

  container.innerHTML = planOrders.map((order, idx) => {
    const status = getStatus(order.status);
    return `<div class="plan-row" id="plan-${order.id}">
      <div class="plan-pos">${idx + 1}</div>
      <div class="plan-info">
        <div class="plan-title">${escapeHtml(order.title)}</div>
        <div class="plan-meta">
          ${escapeHtml(order.customer)} · ${(order.runLength || 0).toLocaleString()} шт. ·
          <span class="badge ${order.status}">${status.label}</span>
        </div>
      </div>
      <div class="plan-date">${renderShipDate(order.shipDate)}</div>
      <div class="plan-controls">
        <button class="btn btn-ghost btn-sm" onclick="movePlanOrder('${order.id}', -1)" ${idx === 0 ? "disabled" : ""}>Вверх</button>
        <button class="btn btn-ghost btn-sm" onclick="movePlanOrder('${order.id}', 1)" ${idx === planOrders.length - 1 ? "disabled" : ""}>Вниз</button>
      </div>
    </div>`;
  }).join("");
}

// свап позиций в массиве (не значений priority) — иначе финальная перенумеровка отменяет перестановку
function movePlanOrder(orderId, direction) {
  const planOrders = orders
    .filter(o => ["approval", "production"].includes(o.status))
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const idx = planOrders.findIndex(o => o.id === orderId);
  const swapIdx = idx + direction;
  if (swapIdx < 0 || swapIdx >= planOrders.length) return;

  [planOrders[idx], planOrders[swapIdx]] = [planOrders[swapIdx], planOrders[idx]];
  planOrders.forEach((o, i) => { o.priority = i; });

  renderProductionPlan();
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

// цены материалов нигде не хранятся — показываем только список списания, без выдуманной суммы
function openOrderMaterialsModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  const items = order.materials || [];
  const rowsHtml = items.length > 0 ? items.map(m => `
    <div class="history-item">
      <span class="dot"></span>
      <span>${escapeHtml(m.name)} — ${escapeHtml(m.qty)} (${m.reason})</span>
      <span class="when">${m.date}</span>
    </div>
  `).join("") : `<span class="muted">Материалы не списывались</span>`;

  openModal(`
    <div class="modal-header"><h3>Заказ #${order.id} · ${escapeHtml(order.title)}</h3></div>
    <div class="modal-body"><div class="history-list">${rowsHtml}</div></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Закрыть</button>
    </div>
  `);
}

function renderStaffList(containerId, roleFilter) {
  const container = document.getElementById(containerId);
  // roleFilter: не задан — все кроме менеджеров; массив — несколько ролей; строка — одна роль
  const people = !roleFilter
    ? STAFF.filter(p => p.role !== "manager")
    : Array.isArray(roleFilter)
      ? STAFF.filter(p => roleFilter.includes(p.role))
      : staffByRole(roleFilter);

  container.innerHTML = people.map(person => {
    const activeOrder = orders.find(o => o.assignee === person.id && o.status !== "done");
    const statusText = activeOrder
      ? `${getStatus(activeOrder.status).label} · заказ #${activeOrder.id} «${escapeHtml(activeOrder.title)}»`
      : "свободен";
    return `
      <div class="staff-row">
        <span style="display:flex;align-items:center;gap:8px">
          <span class="staff-name" onclick="openStaffProfile(${person.id})" style="cursor:pointer">${formatPersonName(person)}</span>
          ${renderWriteButton(person)}
        </span>
        <span class="staff-status">${statusText}</span>
      </div>
    `;
  }).join("");
}
function renderDesignersPage() { renderStaffList("designersList", "designer"); }
function renderWorkersPage()   { renderStaffList("workersList", "worker"); }

// не путать с renderStaffList() выше — та обслуживает плоские списки у менеджера
function renderStaffPage() {
  const container = document.getElementById("staffList");

  const categories = [
{ role: "manager",    label: "Менеджеры" },
{ role: "designer",   label: "Дизайнеры" },
{ role: "worker",     label: "Печатники" },
{ role: "accountant", label: "Бухгалтеры" },
{ role: "economist",  label: "Экономисты" },
{ role: "production_manager", label: "Менеджеры производства" },
{ role: "assistant", label: "Помощники директора" },
{ role: "admin", label: "Администраторы" },
];

  // карточки и списки — в два отдельных массива, иначе раскрытый список разорвал бы ряд карточек
  const cards = [];
  const lists = [];

  categories.forEach(cat => {
    const people = staffByRole(cat.role);
    if (people.length === 0) return;
    const catId = "cat-" + cat.role;

    const peopleHtml = people.map(person => {
      const activeOrder = orders.find(o => o.assignee === person.id && o.status !== "done");
      // assignee — последний исполнитель заказа, "завершённые" значит был им на момент завершения
      const doneOrders = orders.filter(o => o.assignee === person.id && o.status === "done");

      const statusText = activeOrder
        ? `${getStatus(activeOrder.status).label} · заказ #${activeOrder.id} «${escapeHtml(activeOrder.title)}»`
        : "свободен";

      const historyHtml = doneOrders.length > 0
        ? `<div class="staff-history">
             <div class="staff-history-title">Завершённых заказов: ${doneOrders.length}</div>
             ${doneOrders.slice(-3).map(o => `
               <div class="staff-history-item">${escapeHtml(o.title)} · ${o.history[o.history.length - 1]?.when || ""}</div>
             `).join("")}
           </div>`
        : "";

      return `
        <div class="staff-row">
          <div>
            <span class="staff-name" onclick="openStaffProfile(${person.id})" style="cursor:pointer">${formatPersonName(person)}</span>
            ${renderWriteButton(person)}
            <span class="staff-status">${statusText}</span>
            ${historyHtml}
          </div>
        </div>
      `;
    }).join("");

    cards.push(`
      <div class="staff-category-card" id="card-${catId}" onclick="toggleStaffCategory('${catId}')">
        <span class="count">${people.length}</span>
        <span class="role-label">${cat.label}</span>
        <span class="cat-arrow" id="arrow-${catId}">▾</span>
      </div>
    `);
    lists.push(`<div class="staff-category-list hidden" id="${catId}">${peopleHtml}</div>`);
  });

  container.innerHTML = `<div class="staff-category-row">${cards.join("")}</div>${lists.join("")}`;
}

// раскрывает/сворачивает только эту категорию, остальные раскрытые не трогает
function toggleStaffCategory(catId) {
  const list = document.getElementById(catId);
  const arrow = document.getElementById("arrow-" + catId);
  const card = document.getElementById("card-" + catId);
  list.classList.toggle("hidden");
  card.classList.toggle("is-open");
  arrow.textContent = list.classList.contains("hidden") ? "Развернуть" : "Свернуть";
}

// модалки асинхронны, поэтому действие копится здесь, пока модалки его дополняют
let pendingAction = null;

function doAction(orderId, fromStatus, actionIdx) {
  const order = orders.find(o => o.id === orderId);

  // та же функция, что и в renderOrders() — иначе индекс кнопки может указать не на то действие
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

  let note = "";
  if (action.assignTo) note += ` — ${staffName(assigneeId)}`;
  if (action.comment && comment) note += `: ${comment}`;

  order.status = action.to;
  // отражает последнее действие с заказом — любое действие кроме "вернуть с проблемой" сбрасывает флаг
  order.hasProblem = !!action.problem;
  order.assignee = assigneeId;
  // ставится только для действий с явным флагом accept — иначе applyPendingAction сбросил бы его сразу же;
  // ?? currentRole — иначе у заказа без исполнителя (assigneeId null) acceptedBy тоже стал бы null,
  // неотличимо от "не принято", и кнопка не блокировалась бы
  order.acceptedBy = action.accept ? (assigneeId ?? currentRole) : null;

  // historyText нужен, когда action.to совпадает с уже занятым в HISTORY_TEXT ключом другого перехода
  const baseText = action.historyText || HISTORY_TEXT[action.to] || action.label;
  order.history.push({
    text: baseText + note,
    who: ROLE_LABELS[currentRole],
    when: nowLabel(),
  });

  pendingAction = null;
  closeModal();
  renderOrders();
}

// один оверлей (#modalOverlay/#modalBox) на все модалки, openModal() просто меняет содержимое
function openModal(html) {
  document.getElementById("modalBox").innerHTML = html;
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  document.getElementById("modalBox").innerHTML = "";
  // закрытие без завершения (отмена / клик по фону) отменяет всё действие целиком
  pendingAction = null;
}

function closeModalOnOverlay(event) {
  if (event.target.id === "modalOverlay") closeModal();
}

// замена alert() — отдельный оверлей поверх текущей модалки, не трогает её innerHTML/pendingAction,
// так что открытая форма (создание заказа, добавление материала и т.п.) не теряет введённые значения
function showNotify(message) {
  document.getElementById("notifyBox").innerHTML = `
    <div class="modal-body"><p>${message}</p></div>
    <div class="modal-footer">
      <button class="btn btn-primary btn-full" onclick="closeNotify()">ОК</button>
    </div>
  `;
  document.getElementById("notifyOverlay").classList.remove("hidden");
}
function closeNotify() {
  document.getElementById("notifyOverlay").classList.add("hidden");
  document.getElementById("notifyBox").innerHTML = "";
}
function closeNotifyOnOverlay(event) {
  if (event.target.id === "notifyOverlay") closeNotify();
}

// items — массив строк (value=подпись) либо объектов {key,label} (ORDER_TYPES), различаем через typeof
function fillSelect(selectId, items) {
  const sel = document.getElementById(selectId);
  sel.innerHTML = items.map(item => {
    const value = typeof item === "string" ? item : item.key;
    const label = typeof item === "string" ? item : item.label;
    return `<option value="${value}">${label}</option>`;
  }).join("");
}

function pickSize(size, btn) {
  const [w, h] = size.replace(" мм", "").split("×").map(Number);
  document.getElementById("modalOrderLabelW").value = w;
  document.getElementById("modalOrderLabelH").value = h;
  // нет класса .active — "выбранность" через переключение между btn-primary/btn-ghost
  document.querySelectorAll("#modalSizePresets .btn").forEach(b => {
    b.classList.remove("btn-primary");
    b.classList.add("btn-ghost");
  });
  btn.classList.remove("btn-ghost");
  btn.classList.add("btn-primary");
}

function openCreateOrderModal() {
  openModal(`
    <div class="modal-header"><h3>Новый заказ</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Заказчик <span style="color:var(--accent)">*</span></label>
        <input type="text" id="modalOrderCustomer" placeholder="Название компании" list="clientsList" autocomplete="off">
        <datalist id="clientsList"></datalist>
      </div>

      <div class="field">
        <label class="field-label">Email заказчика <span style="color:var(--text-faint)">(необязательно)</span></label>
        <input type="email" id="modalCustomerEmail" placeholder="client@company.ru">
      </div>

      <div class="field">
        <label class="field-label">Наименование <span style="color:var(--accent)">*</span></label>
        <input type="text" id="modalOrderTitle" placeholder="Например, Этикетки для сока">
      </div>

      <div class="field">
        <label class="field-label">Тираж (шт.) <span style="color:var(--accent)">*</span></label>
        <input type="number" id="modalOrderRunLength" min="1" placeholder="напр. 5000">
      </div>

      <div class="field">
        <label class="field-label">Тип заказа</label>
        <select id="modalOrderType"></select>
      </div>

      <div class="field">
        <label class="field-label">Нож / высечка</label>
        <select id="modalKnifeSelect" onchange="onKnifeSelected()"></select>
      </div>

      <div class="field hidden" id="modalNewKnifeBlock">
        <div style="padding:12px;background:var(--accent-lt);border-radius:var(--r-md);border:1px solid var(--accent);font-size:13px">
          Нож будет изготовлен за 3 рабочих дня. Стоимость зависит от размера и формы — уточните у менеджера производства.
        </div>
      </div>

      <div class="field">
        <label class="field-label">
          Размер этикетки, мм <span style="color:var(--accent)">*</span>
          <span id="modalSizeNote" style="color:var(--text-soft);font-weight:400;font-size:11px;margin-left:6px"></span>
        </label>
        <div id="modalSizePresets" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px"></div>
        <div style="display:flex;gap:12px">
          <div style="flex:1">
            <label class="field-label">Ширина, мм</label>
            <input type="number" id="modalOrderLabelW" min="1" step="1" placeholder="55">
          </div>
          <div style="flex:1">
            <label class="field-label">Высота, мм</label>
            <input type="number" id="modalOrderLabelH" min="1" step="1" placeholder="40">
          </div>
        </div>
      </div>

      <div class="field">
        <label class="field-label">Материал <span style="color:var(--accent)">*</span></label>
        <select id="modalMaterial"></select>
      </div>

      <div class="field">
        <label class="field-label">Ламинация</label>
        <select id="modalLamination"></select>
      </div>

      <div class="field">
        <label class="field-label">Машина</label>
        <select id="modalMachine"></select>
      </div>

      <div class="field">
        <label class="field-label">Дата отгрузки <span style="color:var(--accent)">*</span></label>
        <input type="date" id="modalShipDate">
      </div>

      <div class="field">
        <label class="field-label">Срок оплаты <span style="color:var(--text-faint);font-weight:400">(необязательно)</span></label>
        <input type="date" id="modalPaymentDue">
      </div>

      <label class="checkbox-row">
        <input type="checkbox" id="modalUrgentCheck">
        <span>Срочный заказ</span>
      </label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitCreateOrder()">Создать</button>
    </div>
  `);

  fillSelect("modalOrderType", ORDER_TYPES);
  document.querySelector("#modalOrderType option").insertAdjacentHTML("afterend", '<option disabled>──────────</option>');
  fillSelect("modalMaterial", MATERIALS);
  fillSelect("modalLamination", LAMINATION);
  fillSelect("modalMachine", MACHINES);
  // "Нет" не первое в справочнике, а самый частый выбор — ставим значением по умолчанию явно
  document.getElementById("modalLamination").value = "Нет";

  document.getElementById("modalSizePresets").innerHTML = POPULAR_SIZES.map(size =>
    `<button type="button" class="btn btn-ghost btn-sm" onclick="pickSize('${size}', this)">${size}</button>`
  ).join("");

  fillKnifeSelect();
  fillClientsList();

  // вешаем здесь, не на загрузке страницы — разметка модалки пересоздаётся через innerHTML при каждом открытии
  document.getElementById("modalShipDate")
    .addEventListener("keydown", e => { if (e.key === "Enter") submitCreateOrder(); });
}

// свой список опций (не fillSelect) — нужны спецпункты "лазер"/"новый нож" после ножей из базы
function fillKnifeSelect() {
  const sel = document.getElementById("modalKnifeSelect");
  const knifeOptions = KNIVES.map(k => `<option value="${k.id}">${k.name} (${k.notes})</option>`).join("");
  sel.innerHTML = `
    <option value="">— выберите нож из базы —</option>
    ${knifeOptions}
    <option value="laser">Лазерная высечка (без ножа)</option>
    <option value="new_knife">Заказать новый нож (+3 дня)</option>
  `;
}

function onKnifeSelected() {
  const val = document.getElementById("modalKnifeSelect").value;
  const sizeNote = document.getElementById("modalSizeNote");
  const newKnifeBlock = document.getElementById("modalNewKnifeBlock");

  newKnifeBlock.classList.add("hidden");
  sizeNote.textContent = "";

  if (val === "laser" || val === "new_knife") {
    document.getElementById("modalOrderLabelW").value = "";
    document.getElementById("modalOrderLabelH").value = "";

    // тираж стоит в форме раньше ножа — значение уже введено на момент выбора; подсказка ничего не блокирует
    const runLength = Number(document.getElementById("modalOrderRunLength").value) || 0;
    const suggestHint = runLength > 0
      ? ` · при тираже ${runLength.toLocaleString()} шт. обычно выбирают: ${runLength < SMALL_RUN_THRESHOLD ? "лазер" : "новый нож"}`
      : "";

    if (val === "laser") {
      sizeNote.textContent = "введите размер вручную" + suggestHint;
    } else {
      sizeNote.textContent = "введите нужный размер" + suggestHint;
      newKnifeBlock.classList.remove("hidden");
    }
  } else if (val) {
    const knife = KNIVES.find(k => k.id === Number(val));
    if (knife) {
      document.getElementById("modalOrderLabelW").value = knife.width;
      document.getElementById("modalOrderLabelH").value = knife.height;
      sizeNote.textContent = `из ножа ${knife.name} (±1 мм допустимо)`;
    }
  }
}

// собирает CLIENTS из справочника + уже встречавшихся заказчиков — заново при каждом открытии модалки
function fillClientsList() {
  const existing = [...new Set(orders.map(o => o.customer).filter(Boolean))];
  const all = [...new Set([...CLIENTS, ...existing])].sort();
  document.getElementById("clientsList").innerHTML = all.map(c => `<option value="${c}">`).join("");
}

function validateOrderForm() {
  const required = {
    modalOrderCustomer: "Заказчик",
    modalOrderTitle: "Наименование",
    modalOrderRunLength: "Тираж",
    modalOrderLabelW: "Ширина этикетки",
    modalOrderLabelH: "Высота этикетки",
    modalMaterial: "Материал",
    modalShipDate: "Дата отгрузки",
  };
  for (const [id, label] of Object.entries(required)) {
    const val = document.getElementById(id).value.trim();
    if (!val || val === "0") {
      showNotify(`Заполните поле: ${label}`);
      document.getElementById(id).focus();
      return false;
    }
  }

  // отдельно от "обязательного поля" — ловит и отрицательные ("-5"), и нечисловой мусор (NaN > 0 === false)
  const positiveNumeric = {
    modalOrderRunLength: "Тираж",
    modalOrderLabelW: "Ширина этикетки",
    modalOrderLabelH: "Высота этикетки",
  };
  for (const [id, label] of Object.entries(positiveNumeric)) {
    if (!(Number(document.getElementById(id).value) > 0)) {
      showNotify(`Поле «${label}» должно быть больше нуля`);
      document.getElementById(id).focus();
      return false;
    }
  }

  return true;
}

function submitCreateOrder() {
  if (!validateOrderForm()) return;

  const title = document.getElementById("modalOrderTitle").value.trim();
  const customer = document.getElementById("modalOrderCustomer").value.trim();
  const customerEmail = document.getElementById("modalCustomerEmail").value.trim();
  const runLength = Number(document.getElementById("modalOrderRunLength").value) || 0;
  const orderType = document.getElementById("modalOrderType").value;
  const labelW = Math.round(Number(document.getElementById("modalOrderLabelW").value));
  const labelH = Math.round(Number(document.getElementById("modalOrderLabelH").value));
  const labelSize = `${labelW}×${labelH} мм`;
  const material = document.getElementById("modalMaterial").value;
  const lamination = document.getElementById("modalLamination").value;
  const machine = document.getElementById("modalMachine").value;
  const shipDate = document.getElementById("modalShipDate").value;
  const urgent = document.getElementById("modalUrgentCheck").checked;
  const paymentDue = document.getElementById("modalPaymentDue").value || "";

  const knifeVal = document.getElementById("modalKnifeSelect").value;
  const knifeId = knifeVal && knifeVal !== "laser" && knifeVal !== "new_knife" ? Number(knifeVal) : null;
  const cuttingType = knifeVal === "laser" ? "laser" : knifeVal === "new_knife" ? "new_knife" : "knife";
  const needNewKnife = knifeVal === "new_knife";

  const createdBy = STAFF.find(s => s.role === currentRole)?.id || null;

  const newId = generateOrderId();

  // "Повтор" (без изменения макета) идёт сразу к менеджеру производства, минуя дизайнера —
  // approval уже даёт production_manager действие "Передать в производство"
  const initialStatus = orderType === "repeat" ? "approval" : "new";
  const history = [ { text: "Заказ создан", who: ROLE_LABELS[currentRole], when: nowLabel() } ];
  if (initialStatus === "approval") {
    history.push({ text: "Повтор без изменений — сразу на подготовку форм, минуя дизайнера", who: ROLE_LABELS[currentRole], when: nowLabel() });
  }

  orders.push({
    id: newId,
    title,
    customer: customer || "—",
    status: initialStatus,
    assignee: null,
    hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent, materials: [], files: [], customerEmail, priority: 0,
    knifeId, cuttingType, needNewKnife, createdBy, paymentDue,
    clientPrice: null, costPrice: null,
    runLength, orderType, labelSize, material, lamination, machine, shipDate,
    manager: ROLE_LABELS[currentRole],
    history,
  });

  closeModal();
  renderOrders();
}

function openAssigneeModal() {
  const people = staffByRole(pendingAction.action.assignTo);
  const currentAssignee = pendingAction.order.assignee;

  const optionsHtml = people.map(p =>
    `<option value="${p.id}" ${p.id === currentAssignee ? "selected" : ""}>${p.name}</option>`
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
  // тот же механизм комментария, для action.problem просто другой текст вопроса
  const isProblem = !!pendingAction.action.problem;
  const label = isProblem ? "Опишите проблему" : "Что поправить?";
  const placeholder = isProblem ? "Что пошло не так?" : "Опишите, что нужно исправить";

  openModal(`
    <div class="modal-header"><h3>${pendingAction.action.label}</h3></div>
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

// defaultReason: кнопка "на доработку" передаёт "Доработка", обычная — ничего
let pendingMaterialOrderId = null;

function openAddMaterialModal(orderId, defaultReason) {
  pendingMaterialOrderId = orderId;
  openModal(`
    <div class="modal-header"><h3>Добавить материал</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Материал</label>
        <select id="modalMaterialUseName"></select>
      </div>
      <div class="field">
        <label class="field-label">Количество</label>
        <input type="text" id="modalMaterialUseQty" placeholder="напр. 5 кг">
      </div>
      <div class="field">
        <label class="field-label">Причина</label>
        <select id="modalMaterialUseReason"></select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitAddMaterial()">Добавить</button>
    </div>
  `);

  fillSelect("modalMaterialUseName", MATERIALS);
  fillSelect("modalMaterialUseReason", MATERIAL_USE_REASONS);
  if (defaultReason) document.getElementById("modalMaterialUseReason").value = defaultReason;
}

function submitAddMaterial() {
  const order = orders.find(o => o.id === pendingMaterialOrderId);
  const qty = document.getElementById("modalMaterialUseQty").value.trim();
  if (!qty) {
    showNotify("Укажите количество");
    return;
  }
  order.materials.push({
    name: document.getElementById("modalMaterialUseName").value,
    qty,
    date: nowLabel(),
    reason: document.getElementById("modalMaterialUseReason").value,
  });
  pendingMaterialOrderId = null;
  closeModal();
  renderOrders();
}

let pendingFileOrderId = null;
let pendingFileData = null;

function openFileModal(orderId) {
  pendingFileOrderId = orderId;
  pendingFileData = null;
  openModal(`
    <div class="modal-header"><h3>Прикрепить файл</h3></div>
    <div class="modal-body">
      <input type="file" id="modalFileInput" accept=".cdr,.psd,.pdf,.ai,.tiff,.tif,.zip,.jpg,.png" onchange="onFileSelected(event)" style="display:none">
      <div class="file-drop-zone" id="modalFileDropZone" onclick="document.getElementById('modalFileInput').click()">
        <div class="file-drop-text">Нажмите чтобы выбрать файл</div>
        <div class="file-drop-hint">CDR, PSD, PDF, AI, TIFF, ZIP — до 50 МБ</div>
      </div>
      <div id="modalFilePreview" class="hidden file-preview-block"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="attachFile()">Прикрепить</button>
    </div>
  `);
}

function onFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;
  const ext = file.name.split(".").pop().toLowerCase();
  const sizeMB = (file.size / 1024 / 1024).toFixed(1);
  pendingFileData = {
    id: Date.now(),
    name: file.name,
    size: `${sizeMB} МБ`,
    type: ext,
    addedBy: getRoleLabel(currentRole),
    addedAt: nowLabel(),
  };
  const preview = document.getElementById("modalFilePreview");
  preview.innerHTML = `
    <span class="file-preview-icon">${fileIcon(ext)}</span>
    <span class="file-preview-name">${file.name}</span>
    <span class="file-preview-size">${sizeMB} МБ</span>
  `;
  preview.classList.remove("hidden");
  document.getElementById("modalFileDropZone").classList.add("hidden");
}

function attachFile() {
  if (!pendingFileData) { showNotify("Выберите файл"); return; }
  const order = orders.find(o => o.id === pendingFileOrderId);
  order.files.push(pendingFileData);
  order.history.push({
    text: `Прикреплён файл: ${pendingFileData.name}`,
    who: getRoleLabel(currentRole), when: nowLabel(),
  });
  pendingFileOrderId = null;
  pendingFileData = null;
  closeModal();
  renderOrders();
}

// переиспользует historySortKey(), написанный для архива — тот же смысл "что новее"
function openStaffProfile(personId) {
  const person = STAFF.find(p => p.id === personId);
  if (!person) return;

  const personOrders = orders.filter(o => o.assignee === personId)
    .slice()
    .sort((a, b) => historySortKey(b) - historySortKey(a));

  const initials = person.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const avatarInner = person.photo ? `<img src="${person.photo}" alt="${person.name}">` : initials;

  const ordersHtml = personOrders.length > 0 ? personOrders.map(o => {
    const status = getStatus(o.status);
    const lastEvent = o.history[o.history.length - 1];
    return `
      <div class="history-item">
        <span class="dot"></span>
        <span>#${o.id} · ${escapeHtml(o.title)} · <span class="badge ${status.key}">${status.label}</span></span>
        <span class="when">${lastEvent?.when || ""}</span>
      </div>
    `;
  }).join("") : `<span class="muted">Заказов нет</span>`;

  openModal(`
    <div class="modal-header"><h3>${formatPersonName(person)}</h3></div>
    <div class="modal-body">
      <div class="profile-avatar">${avatarInner}</div>
      <div class="history-title" style="margin:12px 0 8px">Заказы</div>
      <div class="history-list">${ordersHtml}</div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Закрыть</button>
    </div>
  `);
}

// раздел "Пользователи" — только для admin. Задача просила не трогать index.html,
// поэтому секция page-users создаётся тем же способом, что и остальные page-section,
// но динамически, а не как статическая разметка
(function ensureUsersPageSection() {
  const section = document.createElement("section");
  section.className = "page-section hidden";
  section.id = "page-users";
  section.innerHTML = `<div id="usersList"></div>`;
  document.querySelector(".page-body").appendChild(section);
})();

function renderUsersPage() {
  const container = document.getElementById("usersList");

  const rows = STAFF.map(person => `
    <tr>
      <td>${person.name}</td>
      <td>${getRoleLabel(person.role)}</td>
      <td>—</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="openEditUserRoleModal(${person.id})">Изменить роль</button>
        <button class="btn btn-ghost btn-sm" onclick="openDeleteUserModal(${person.id})">Удалить</button>
      </td>
    </tr>
  `).join("");

  container.innerHTML = `
    <button class="btn btn-primary" onclick="openAddUserModal()" style="margin-bottom:var(--sp-4)">+ Добавить сотрудника</button>
    <table class="report-table">
      <thead>
        <tr><th>ФИО</th><th>Роль</th><th>Email</th><th>Действия</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function roleSelectOptions(selectedRole) {
  return Object.keys(ROLE_LABELS).map(key =>
    `<option value="${key}" ${key === selectedRole ? "selected" : ""}>${ROLE_LABELS[key]}</option>`
  ).join("");
}

function openAddUserModal() {
  openModal(`
    <div class="modal-header"><h3>Добавить сотрудника</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Имя</label>
        <input type="text" id="modalNewUserName" placeholder="Иванов Иван">
      </div>
      <div class="field">
        <label class="field-label">Роль</label>
        <select id="modalNewUserRole">${roleSelectOptions("manager")}</select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitAddUser()">Сохранить</button>
    </div>
  `);
}

function submitAddUser() {
  const name = document.getElementById("modalNewUserName").value.trim();
  if (!name) {
    showNotify("Укажите имя сотрудника");
    return;
  }
  const role = document.getElementById("modalNewUserRole").value;
  const newId = STAFF.length ? Math.max(...STAFF.map(s => s.id)) + 1 : 1;
  STAFF.push({ id: newId, name, role, photo: null });
  closeModal();
  renderUsersPage();
}

let pendingEditUserId = null;

function openEditUserRoleModal(personId) {
  const person = STAFF.find(p => p.id === personId);
  if (!person) return;
  pendingEditUserId = personId;
  openModal(`
    <div class="modal-header"><h3>Изменить роль — ${person.name}</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Роль</label>
        <select id="modalEditUserRole">${roleSelectOptions(person.role)}</select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitEditUserRole()">Сохранить</button>
    </div>
  `);
}

function submitEditUserRole() {
  const person = STAFF.find(p => p.id === pendingEditUserId);
  if (!person) return;
  person.role = document.getElementById("modalEditUserRole").value;
  pendingEditUserId = null;
  closeModal();
  renderUsersPage();
}

let pendingDeleteUserId = null;

// подтверждение через модалку, не confirm() — единая механика для всех подтверждений в проекте
function openDeleteUserModal(personId) {
  const person = STAFF.find(p => p.id === personId);
  if (!person) return;
  pendingDeleteUserId = personId;
  openModal(`
    <div class="modal-header"><h3>Удалить сотрудника?</h3></div>
    <div class="modal-body">
      <p>${person.name} (${getRoleLabel(person.role)}) будет удалён из списка сотрудников.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="confirmDeleteUser()">Удалить</button>
    </div>
  `);
}

function confirmDeleteUser() {
  const idx = STAFF.findIndex(p => p.id === pendingDeleteUserId);
  if (idx !== -1) STAFF.splice(idx, 1);
  pendingDeleteUserId = null;
  closeModal();
  renderUsersPage();
}

// economist видит только свои предложения, director — все, с кнопками решения
function renderProposalsPage() {
  const container = document.getElementById("proposalsList");

  if (currentRole === "economist") {
    const myId = STAFF.find(s => s.role === "economist")?.id;
    const mine = PROPOSALS.filter(p => p.proposedBy === myId);
    container.innerHTML = `
      <button class="btn btn-primary" onclick="openNewProposalModal()" style="margin-bottom:var(--sp-4)">+ Новое предложение</button>
      ${renderProposalsList(mine, false)}
    `;
    return;
  }

  if (currentRole === "director") {
    container.innerHTML = renderProposalsList(PROPOSALS, true);
    return;
  }

  container.innerHTML = `<span class="muted">раздел в разработке</span>`;
}

function renderProposalsList(list, showActions) {
  if (!list.length) return `<span class="muted">Предложений нет</span>`;

  const statusLabel = { pending: "На рассмотрении", approved: "Одобрено", rejected: "Отклонено" };
  const statusBadgeClass = { pending: "approval", approved: "production", rejected: "rework" };

  return list.slice().reverse().map(p => `
    <div class="plan-row">
      <div class="plan-info">
        <div class="plan-title">${escapeHtml(p.title)} — ${p.price.toLocaleString()} ₽</div>
        <div class="plan-meta">
          ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" rel="noopener">ссылка</a> · ` : ""}${p.comment ? `${escapeHtml(p.comment)} · ` : ""}${staffName(p.proposedBy)} · ${p.createdAt}
        </div>
      </div>
      <span class="badge ${statusBadgeClass[p.status]}">${statusLabel[p.status]}</span>
      ${showActions && p.status === "pending" ? `
        <div class="plan-controls">
          <button class="btn btn-ok btn-sm" onclick="reviewProposal(${p.id}, 'approved')">Одобрить</button>
          <button class="btn btn-ghost btn-sm" onclick="reviewProposal(${p.id}, 'rejected')">Отклонить</button>
        </div>
      ` : ""}
    </div>
  `).join("");
}

function openNewProposalModal() {
  openModal(`
    <div class="modal-header"><h3>Новое предложение</h3></div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Название товара</label>
        <input type="text" id="modalProposalTitle" placeholder="Например, Пленка PP белая, новый поставщик">
      </div>
      <div class="field">
        <label class="field-label">Ссылка <span style="color:var(--text-faint);font-weight:400">(необязательно)</span></label>
        <input type="text" id="modalProposalLink" placeholder="https://...">
      </div>
      <div class="field">
        <label class="field-label">Цена, ₽</label>
        <input type="number" id="modalProposalPrice" min="0" step="1" placeholder="5000">
      </div>
      <div class="field">
        <label class="field-label">Комментарий <span style="color:var(--text-faint);font-weight:400">(необязательно)</span></label>
        <textarea id="modalProposalComment" rows="3" placeholder="Почему стоит рассмотреть"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitProposal()">Отправить</button>
    </div>
  `);
}

function submitProposal() {
  const title = document.getElementById("modalProposalTitle").value.trim();
  const price = Number(document.getElementById("modalProposalPrice").value) || 0;
  if (!title || !price) {
    showNotify("Укажите название и цену");
    return;
  }
  const link = document.getElementById("modalProposalLink").value.trim();
  const comment = document.getElementById("modalProposalComment").value.trim();
  const proposedBy = STAFF.find(s => s.role === currentRole)?.id || null;

  PROPOSALS.push({
    id: Date.now(),
    title, link, price, comment, proposedBy,
    status: "pending",
    createdAt: nowLabel(),
  });

  closeModal();
  renderProposalsPage();
}

function reviewProposal(id, status) {
  if (currentRole !== "director") return;
  const proposal = PROPOSALS.find(p => p.id === id);
  if (proposal) proposal.status = status;
  renderProposalsPage();
}

function findOrCreateChat(withStaffId) {
  const myId = STAFF.find(s => s.role === currentRole)?.id;
  let chat = CHATS.find(c =>
    c.participants.includes(myId) && c.participants.includes(withStaffId)
  );
  if (!chat) {
    chat = { id: Date.now(), participants: [myId, withStaffId], messages: [] };
    CHATS.push(chat);
  }
  return chat;
}

function openChatWith(staffId) {
  const chat = findOrCreateChat(staffId);
  openChatId = chat.id;
  goto("chat");
}

// не-чатующие роли просто не трогаем — статичная заглушка "раздел в разработке" из index.html остаётся как есть
function renderChatPage() {
  const canChat = ["director", "assistant", "designer"].includes(currentRole);
  if (!canChat) {
    // контейнер мог остаться с чужим диалогом от предыдущей роли — перезаписываем явно
    document.getElementById("page-chat").innerHTML = `<p class="muted">раздел в разработке</p>`;
    return;
  }

  if (openChatId) {
    renderChatWindow(openChatId);
    return;
  }
  if (currentRole === "director") {
    renderAllChatsList();
    return;
  }
  document.getElementById("page-chat").innerHTML =
    `<span class="muted">Выберите собеседника — кнопка «Написать» на карточке сотрудника</span>`;
}

function renderChatWindow(chatId) {
  const container = document.getElementById("page-chat");
  const chat = CHATS.find(c => c.id === chatId);
  if (!chat) {
    container.innerHTML = `<span class="muted">Диалог не найден</span>`;
    return;
  }

  const myId = STAFF.find(s => s.role === currentRole)?.id;
  const other = STAFF.find(s => s.id === chat.participants.find(id => id !== myId));

  const messagesHtml = chat.messages.map(m => `
    <div class="chat-bubble-row${m.from === myId ? " mine" : ""}">
      <div class="chat-bubble">
        <div class="chat-bubble-text">${escapeHtml(m.text)}</div>
        <div class="chat-bubble-when">${m.when}</div>
      </div>
    </div>
  `).join("");

  // "Все переписки" — только у director, у него же есть доступ к чужим диалогам
  const backBtn = currentRole === "director"
    ? `<button class="btn btn-ghost btn-sm" onclick="openChatId = null; renderAllChatsList()">Назад</button>`
    : "";

  container.innerHTML = `
    <div class="chat-header">
      ${backBtn}
      <div class="chat-header-name">${other ? formatPersonName(other) : "—"}</div>
    </div>
    <div class="chat-messages" id="chatMessagesBox">${messagesHtml || '<span class="muted">Сообщений пока нет</span>'}</div>
    <div class="chat-input-row">
      <input type="text" id="chatInput" placeholder="Сообщение..." onkeydown="if (event.key === 'Enter') sendChatMessage(${chatId})">
      <button class="btn btn-primary" onclick="sendChatMessage(${chatId})">Отправить</button>
    </div>
  `;

  const box = document.getElementById("chatMessagesBox");
  box.scrollTop = box.scrollHeight;
}

function sendChatMessage(chatId) {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  const chat = CHATS.find(c => c.id === chatId);
  const myId = STAFF.find(s => s.role === currentRole)?.id;
  chat.messages.push({ from: myId, text, when: nowLabel() });
  input.value = "";
  renderChatWindow(chatId);
}

// только director — видит все переписки в системе, не только свои
function renderAllChatsList() {
  const container = document.getElementById("page-chat");
  if (!CHATS.length) {
    container.innerHTML = `<span class="muted">Переписок пока нет</span>`;
    return;
  }
  container.innerHTML = CHATS.map(chat => {
    const [a, b] = chat.participants.map(id => STAFF.find(s => s.id === id));
    const last = chat.messages[chat.messages.length - 1];
    return `
      <div class="staff-row" style="cursor:pointer" onclick="viewChat(${chat.id})">
        <div>
          <span class="staff-name">${a ? formatPersonName(a) : "—"} — ${b ? formatPersonName(b) : "—"}</span>
          <span class="staff-status">${last ? `${escapeHtml(last.text)} · ${last.when}` : "нет сообщений"}</span>
        </div>
      </div>
    `;
  }).join("");
}

function viewChat(chatId) {
  openChatId = chatId;
  renderChatWindow(chatId);
}

// временно вне login() — скрипт подключён в конце body, #rolePickList уже есть в DOM
renderRolePicker();
