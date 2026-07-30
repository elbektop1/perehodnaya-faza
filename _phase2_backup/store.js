/* ============================================================
   store.js — единый слой данных В ПАМЯТИ (без localStorage).
   Функции-репозитории — единственная точка доступа к данным.
   Тело функций позже меняется на fetch('/api/...') без правки UI
   (см. MASTER_PLAN.md §2).

   Подключать после reference_data.js (справочники читаются оттуда
   один раз при загрузке и хранятся здесь как приватное поле стора,
   не как отдельные глобальные const).
============================================================ */

window.Store = (function () {

  // --- orders — копия текущего прототипа (app.js:269-430), в памяти ---
  let orders = [
    {
      id: "RL7X2A", title: "Этикетки для сока «Сады»", customer: "ООО Сады",
      status: "new", assignee: null,
      hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "client@test.ru", priority: 0,
      knifeId: null, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
      clientPrice: null, costPrice: null,
      runLength: 5000, orderType: "new", labelSize: "60×40 мм",
      material: "Бумага полуглянец акрил", lamination: "Нет", machine: "GALLUS 160",
      shipDate: "2026-07-15", manager: "Менеджер",
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
      shipDate: "2026-07-20", manager: "Менеджер",
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

  // --- сотрудники — копия STAFF (app.js:2-43), нужна для исполнителей/модалки назначения ---
  const staff = [
    { id: 1,  name: "Кылычев Алик",         role: "director",   photo: null },
    { id: 2,  name: "Богомолова Виктория",  role: "assistant",  photo: null },
    { id: 10, name: "Лукина Римма",         role: "manager",    photo: null },
    { id: 11, name: "Шаповалова Юлия",      role: "manager",    photo: null },
    { id: 12, name: "Шаповалов Дмитрий",    role: "manager",    photo: null },
    { id: 13, name: "Денисова Татьяна",     role: "manager",    photo: null },
    { id: 14, name: "Овечкин Константин",   role: "manager",    photo: null },
    { id: 15, name: "Одинцов Алексей",      role: "manager",    photo: null },
    { id: 16, name: "Баранов Александр",    role: "manager",    photo: null },
    { id: 17, name: "Володин Александр",    role: "manager",    photo: null },
    { id: 20, name: "Одинцов Вадим",        role: "designer",   photo: null },
    { id: 21, name: "Ботов Глеб",           role: "designer",   photo: null },
    { id: 40, name: "Бейгул Дмитрий",       role: "economist",  photo: null },
    { id: 45, name: "Алексеева Яна",        role: "accountant", photo: null },
    { id: 50, name: "Щербакова Юлия",       role: "production_manager", photo: null },
    { id: 60, name: "Кондратьев Алексей",   role: "worker",     photo: null },
    { id: 61, name: "Замятин Александр",    role: "worker",     photo: null },
    { id: 62, name: "Дурдиев Атаджан",      role: "worker",     photo: null },
    { id: 63, name: "Курбанбаев Хамид",     role: "worker",     photo: null },
    { id: 64, name: "Керимов Анатолий",     role: "worker",     photo: null },
    { id: 65, name: "Авезов Шатлык",        role: "worker",     photo: null },
    { id: 66, name: "Байрам",               role: "worker",     photo: null },
    { id: 99, name: "Дерябин Юрий",         role: "admin",      photo: null },
  ];

  // --- справочники — берутся из reference_data.js (подключён раньше store.js) ---
  const materials         = MATERIALS;
  const lamination        = LAMINATION;
  const inks               = INKS;
  const machines           = MACHINES;
  const orderTypes         = ORDER_TYPES;
  const knives             = KNIVES;
  const clients            = CLIENTS;
  const materialStock      = MATERIAL_STOCK;
  const inkStock           = INK_STOCK;
  const smallRunThreshold  = SMALL_RUN_THRESHOLD;
  const popularSizes       = POPULAR_SIZES;
  const materialUseReasons = MATERIAL_USE_REASONS;

  // --- репозиторий заказов ---
  function getOrders() {
    return orders;
  }

  function getOrderById(id) {
    return orders.find(o => o.id === id) || null;
  }

  function saveOrder(order) {
    const i = orders.findIndex(o => o.id === order.id);
    if (i === -1) {
      orders.push(order);
    } else {
      orders[i] = order;
    }
    return order;
  }

  function getStaff() {
    return staff;
  }

  // --- репозиторий справочников ---
  function getMaterials()         { return materials; }
  function getLamination()        { return lamination; }
  function getInks()              { return inks; }
  function getMachines()          { return machines; }
  function getOrderTypes()        { return orderTypes; }
  function getKnives()            { return knives; }
  function getClients()           { return clients; }
  function getMaterialStock()     { return materialStock; }
  function getInkStock()          { return inkStock; }
  function getSmallRunThreshold() { return smallRunThreshold; }
  function getPopularSizes()      { return popularSizes; }
  function getMaterialUseReasons(){ return materialUseReasons; }

  return {
    getOrders, getOrderById, saveOrder, getStaff,
    getMaterials, getLamination, getInks, getMachines, getOrderTypes,
    getKnives, getClients, getMaterialStock, getInkStock,
    getSmallRunThreshold, getPopularSizes, getMaterialUseReasons,
  };

})();
