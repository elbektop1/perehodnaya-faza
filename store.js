window.Store = (function () {

  // --- orders — копия текущего прототипа (app.js:269-430), в памяти ---
  let orders = [
    {
      id: "RL7X2A", title: "Этикетки для сока «Сады»", customer: "ООО Сады",
      status: "new", assignee: null,
      hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "client@test.ru", priority: 0,
      knifeId: null, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
      clientPrice: null, costPrice: null, paidAmount: 0, payments: [], deferral: null,
      blank: null, blankHistory: [],
      runLength: 5000, orderType: "new", labelSize: "60×40 мм",
      material: "Бумага полуглянец акрил", lamination: "Нет", machine: "Gallus 160",
      shipDate: "2026-07-15", manager: "Менеджер",
      history: [ { text: "Заказ создан", who: "менеджер", when: "12 июн, 10:24" } ],
    },
    {
      id: "KP5W9B", title: "Наклейки на банки мёда", customer: "ИП Иванов",
      status: "design", assignee: 20,
      hasProblem: false, paid: false, expanded: false, acceptedBy: null, urgent: false, materials: [], files: [], customerEmail: "", priority: 0,
      knifeId: 14, cuttingType: "knife", needNewKnife: false, createdBy: 10, paymentDue: "",
      clientPrice: null, costPrice: null, paidAmount: 0, payments: [], deferral: null,
      blank: {
        id: "BLK-0002", version: 1, status: "rejected", sentAt: "2026-07-15", signedAt: null,
        signedBy: "", fileName: "", note: "Клиент просит увеличить логотип и поменять шрифт даты",
      },
      blankHistory: [],
      runLength: 12000, orderType: "repeat", labelSize: "55×55 мм",
      material: "Пленка PP белая акрил", lamination: "Ламинация глянец", machine: "Weigang 450",
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
      clientPrice: 62000, costPrice: 41000, paidAmount: 62000,
      payments: [ { id: "PMT-0001", amount: 62000, date: "2026-06-18", method: "безнал", who: 45, note: "" } ],
      deferral: null,
      blank: null, blankHistory: [],
      runLength: 20000, orderType: "repeat", labelSize: "55×55 мм",
      material: "Пленка PP белая акрил", lamination: "Ламинация глянец", machine: "Weigang 450",
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
      clientPrice: 21000, costPrice: 15500, paidAmount: 0, payments: [],
      deferral: { approvedBy: 1, until: "2026-07-08", amount: 21000, reason: "Просрочена по договору", createdAt: "2026-06-20" },
      blank: null, blankHistory: [],
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
      clientPrice: null, costPrice: null, paidAmount: 0, payments: [], deferral: null,
      blank: null, blankHistory: [],
      runLength: 15000, orderType: "repeat_changed", labelSize: "70×50 мм",
      material: "Пленка метализированная акрил", lamination: "Тиснение золото", machine: "Gallus 200",
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
      clientPrice: null, costPrice: null, paidAmount: 0, payments: [], deferral: null,
      blank: null, blankHistory: [],
      runLength: 30000, orderType: "new", labelSize: "100×70 мм",
      material: "Бумага полуглянец глубокая заморозка", lamination: "Ламинация матовая", machine: "Weigang 450",
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
      clientPrice: null, costPrice: null, paidAmount: 0, payments: [], deferral: null,
      blank: { id: "BLK-0001", version: 1, status: "draft", sentAt: null, signedAt: null, signedBy: "", fileName: "", note: "" },
      blankHistory: [],
      runLength: 6000, orderType: "new", labelSize: "58×40 мм",
      material: "Пленка PP белая на PET подложке", lamination: "Нет", machine: "Bengraphic 330",
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
      clientPrice: null, costPrice: null, paidAmount: 0, payments: [], deferral: null,
      blank: {
        id: "BLK-0003", version: 2, status: "sent", sentAt: "2026-07-19", signedAt: null,
        signedBy: "", fileName: "blank_AP9M3L_v2.jpg", note: "",
      },
      blankHistory: [
        { id: "BLK-0003", version: 1, status: "rejected", sentAt: "2026-07-10", signedAt: null,
          signedBy: "", fileName: "blank_AP9M3L_v1.jpg", note: "Не читается штрихкод на этикетке" },
      ],
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
      clientPrice: 54000, costPrice: 39000, paidAmount: 30000,
      payments: [ { id: "PMT-0001", amount: 30000, date: "2026-07-01", method: "безнал", who: 45, note: "Предоплата 50%" } ],
      deferral: null,
      blank: {
        id: "BLK-0004", version: 1, status: "signed", sentAt: "2026-06-29", signedAt: "2026-06-30",
        signedBy: "Кузьмина О. (СеверПродукт)", fileName: "blank_PR4T7X_v1.jpg", note: "",
      },
      blankHistory: [],
      runLength: 18000, orderType: "repeat_changed", labelSize: "58×60 мм",
      material: "Пленка PE 100 мкр белая", lamination: "Нет", machine: "Weigang 450",
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
      clientPrice: 33000, costPrice: 36000, paidAmount: 0, payments: [],
      deferral: { approvedBy: 1, until: "2026-07-25", amount: 33000, reason: "Постоянный клиент, короткая отсрочка", createdAt: "2026-07-05" },
      blank: {
        id: "BLK-0005", version: 1, status: "signed", sentAt: "2026-06-26", signedAt: "2026-06-26",
        signedBy: "Абишев Р.", fileName: "blank_RD6W1H_v1.jpg", note: "",
      },
      blankHistory: [],
      runLength: 10000, orderType: "new", labelSize: "50×70 мм",
      material: "Термо Топ", lamination: "Нет", machine: "Gallus 160",
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

  // --- реестр документов (Фаза 9) — договоры, спецификации, счета, бланки, произв. пакеты и т.п. ---
  let documents = [
    {
      id: "DOC-0001", type: "contract", name: "Договор — ООО «ЭНДЖОЙ ФУД»", version: 1, status: "archived",
      orderId: null, clientId: "CL001", fileName: "ДОГОВОР_пример.doc", uploadedBy: 10,
      uploadedAt: "2026-06-01", note: "", prevVersionId: null,
    },
    {
      id: "DOC-0009", type: "contract", name: "Договор — ООО «ЭНДЖОЙ ФУД»", version: 2, status: "active",
      orderId: null, clientId: "CL001", fileName: "ДОГОВОР_пример.doc", uploadedBy: 10,
      uploadedAt: "2026-07-11", note: "Обновлены условия оплаты", prevVersionId: "DOC-0001",
    },
    {
      id: "DOC-0002", type: "specification", name: "Спецификация — заказ RL7X2A", version: 1, status: "active",
      orderId: "RL7X2A", clientId: null, fileName: "Спецификация_пример.docx", uploadedBy: 10,
      uploadedAt: "2026-06-12", note: "", prevVersionId: null,
    },
    {
      id: "DOC-0003", type: "blank", name: "Бланк согласования — PR4T7X", version: 1, status: "active",
      orderId: "PR4T7X", clientId: null, fileName: "blank_PR4T7X_v1.jpg", uploadedBy: 10,
      uploadedAt: "2026-06-30", note: "Подписал: Кузьмина О. (СеверПродукт)", prevVersionId: null,
    },
    {
      id: "DOC-0004", type: "blank", name: "Бланк согласования — RD6W1H", version: 1, status: "active",
      orderId: "RD6W1H", clientId: null, fileName: "blank_RD6W1H_v1.jpg", uploadedBy: 11,
      uploadedAt: "2026-06-26", note: "Подписал: Абишев Р.", prevVersionId: null,
    },
    {
      id: "DOC-0005", type: "invoice", name: "Счёт — заказ MN3J4C", version: 1, status: "active",
      orderId: "MN3J4C", clientId: null, fileName: "Счет_пример.pdf", uploadedBy: 45,
      uploadedAt: "2026-06-18", note: "", prevVersionId: null,
    },
    {
      id: "DOC-0006", type: "production_package", name: "Производственный пакет — PR4T7X", version: 1, status: "active",
      orderId: "PR4T7X", clientId: null, fileName: "Производственный_пакет_PR4T7X.pdf", uploadedBy: 50,
      uploadedAt: "2026-07-01", note: "", prevVersionId: null,
    },
    {
      id: "DOC-0007", type: "other", name: "Макет Попкорн 100×100", version: 1, status: "active",
      orderId: null, clientId: "CL001", fileName: "Макет Попкорн 100×100.pdf", uploadedBy: 20,
      uploadedAt: "2026-07-05", note: "", prevVersionId: null,
    },
    {
      id: "DOC-0008", type: "other", name: "ТЗ клиента по попкорну", version: 1, status: "active",
      orderId: null, clientId: "CL001", fileName: "ТЗ клиента по попкорну.docx", uploadedBy: 10,
      uploadedAt: "2026-07-02", note: "", prevVersionId: null,
    },
  ];
  let documentCounter = 9;

  function nextDocumentId() {
    documentCounter++;
    return "DOC-" + String(documentCounter).padStart(4, "0");
  }

  function getDocuments(filter = {}) {
    return documents.filter(d =>
      (filter.type == null || d.type === filter.type) &&
      (filter.orderId == null || d.orderId === filter.orderId) &&
      (filter.clientId == null || d.clientId === filter.clientId) &&
      (filter.status == null || d.status === filter.status)
    );
  }

  function addDocument(data) {
    const doc = {
      id: nextDocumentId(), type: data.type, name: data.name, version: 1, status: "active",
      orderId: data.orderId || null, clientId: data.clientId || null,
      fileName: data.fileName || "", uploadedBy: data.uploadedBy || null,
      uploadedAt: data.uploadedAt, note: data.note || "", prevVersionId: null,
    };
    documents.push(doc);
    return doc;
  }

  function reviseDocument(docId, data) {
    const old = documents.find(d => d.id === docId);
    if (!old || old.status !== "active") return null;
    old.status = "archived";
    const doc = {
      id: nextDocumentId(), type: old.type, name: data.name || old.name, version: old.version + 1, status: "active",
      orderId: data.orderId !== undefined ? data.orderId : old.orderId,
      clientId: data.clientId !== undefined ? data.clientId : old.clientId,
      fileName: data.fileName || old.fileName, uploadedBy: data.uploadedBy || old.uploadedBy,
      uploadedAt: data.uploadedAt, note: data.note || "", prevVersionId: old.id,
    };
    documents.push(doc);
    return doc;
  }

  function archiveDocument(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc || doc.status !== "active") return null;
    doc.status = "archived";
    return doc;
  }

  // цепочка версий от v1 до последней — принимает id любой версии из цепочки
  function getDocumentVersions(docId) {
    let head = documents.find(d => d.id === docId);
    if (!head) return [];
    let next;
    while ((next = documents.find(d => d.prevVersionId === head.id))) head = next;
    const chain = [];
    let cur = head;
    while (cur) {
      chain.unshift(cur);
      cur = cur.prevVersionId ? documents.find(d => d.id === cur.prevVersionId) : null;
    }
    return chain;
  }

  // --- уведомления (Фаза 10) — адресные события, не журнал (тот отдельно — order.history/history) ---
  let notifications = [
    {
      id: "NTF-0001", type: "task", title: "Новая задача", text: "Проверить макет — заказ DS2K8P",
      recipientId: 20, read: false, createdAt: new Date("2026-07-16T09:10").getTime(), link: { section: "tasks", entityId: "ЗАД-0003" },
    },
    {
      id: "NTF-0002", type: "question", title: "Новый вопрос", text: "Уточнить намотку по бланку",
      recipientId: 20, read: false, createdAt: new Date("2026-07-18T11:00").getTime(), link: { section: "questions", entityId: "ВОП-0048" },
    },
    {
      id: "NTF-0003", type: "order_status", title: "Статус заказа изменён", text: "DS2K8P — На согласовании",
      recipientId: 10, read: true, createdAt: new Date("2026-07-20T15:40").getTime(), link: { section: "orders", entityId: "DS2K8P" },
    },
    {
      id: "NTF-0004", type: "news", title: "Новая новость", text: "Новый порядок принятия заказа в работу",
      recipientId: 10, read: false, createdAt: new Date("2026-07-23T09:05").getTime(), link: { section: "news", entityId: "N1" },
    },
    {
      id: "NTF-0005", type: "news", title: "Новая новость", text: "Актуальные условия по спецификациям",
      recipientId: 11, read: false, createdAt: new Date("2026-07-22T14:10").getTime(), link: { section: "news", entityId: "N2" },
    },
    {
      id: "NTF-0006", type: "blank", title: "Бланк отправлен на согласование", text: "AP9M3L — ждём ответ клиента",
      recipientId: 10, read: false, createdAt: new Date("2026-07-19T15:45").getTime(), link: { section: "approvals", entityId: "AP9M3L" },
    },
    {
      id: "NTF-0007", type: "task", title: "Новая задача", text: "Согласовать отсрочку",
      recipientId: 1, read: false, createdAt: new Date("2026-07-16T10:00").getTime(), link: { section: "tasks", entityId: "ЗАД-0005" },
    },
    {
      id: "NTF-0008", type: "order_status", title: "Статус заказа изменён", text: "PR4T7X — В производстве",
      recipientId: 60, read: false, createdAt: new Date("2026-07-01T09:05").getTime(), link: { section: "orders", entityId: "PR4T7X" },
    },
  ];
  let notificationCounter = 8;

  function nextNotificationId() {
    notificationCounter++;
    return "NTF-" + String(notificationCounter).padStart(4, "0");
  }

  function getNotifications(staffId, opts = {}) {
    let list = notifications;
    if (staffId != null) list = list.filter(n => n.recipientId === staffId);
    if (opts.types) list = list.filter(n => opts.types.includes(n.type));
    if (opts.unreadOnly) list = list.filter(n => !n.read);
    return list.slice().sort((a, b) => b.createdAt - a.createdAt);
  }

  function addNotification(data) {
    const n = {
      id: nextNotificationId(), type: data.type, title: data.title, text: data.text || "",
      recipientId: data.recipientId, read: false, createdAt: data.createdAt, link: data.link || null,
    };
    notifications.push(n);
    return n;
  }

  function markRead(id) {
    const n = notifications.find(x => x.id === id);
    if (n) n.read = true;
    return n;
  }

  function markAllRead(staffId) {
    notifications.filter(n => n.recipientId === staffId).forEach(n => n.read = true);
  }

  function getUnreadCount(staffId) {
    return notifications.filter(n => n.recipientId === staffId && !n.read).length;
  }

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

  // --- CRM: клиенты (ТЗ §10.2) — часть company совпадает с customer в orders выше,
  // это даёт реальную связку клиент↔заказы без поля clientId в заказе ---
  let clients = [
    { id: "CL001", company: "ООО «ЭНДЖОЙ ФУД»", inn: "7810641453", city: "Санкт-Петербург",
      segment: "Продукты питания · попкорн", source: "Рекомендация", manager: 10,
      stage: "Договор", nextAction: "Подтвердить запуск заказа в работу", nextActionDate: "2026-07-16",
      lastTouch: "2026-07-11", comment: "Договор подписан, ведём реальные заказы." },
    { id: "CL002", company: "ООО «ТМК Мясо»", inn: "", city: "Москва",
      segment: "Мясная продукция", source: "Холодный поиск", manager: 11,
      stage: "На просчёте", nextAction: "Получить ТЗ и макеты", nextActionDate: "2026-07-14",
      lastTouch: "2026-07-10", comment: "Нужен расчёт по тиражам." },
    { id: "CL003", company: "Grass", inn: "", city: "Москва",
      segment: "Бытовая химия", source: "Выставка", manager: 12,
      stage: "Переговоры", nextAction: "Обсудить условия поставки и реферальную систему", nextActionDate: "2026-07-17",
      lastTouch: "2026-07-12", comment: "Горячий клиент, интерес к качеству и срокам." },
    { id: "CL004", company: "ООО «Фрутти»", inn: "", city: "Москва",
      segment: "Соки и сиропы", source: "Сайт", manager: 10,
      stage: "КП отправлено", nextAction: "Повторно связаться, короткое письмо + звонок", nextActionDate: "2026-07-13",
      lastTouch: "2026-07-11", comment: "КП отправлено, ответа нет 2 дня." },
    { id: "CL005", company: "ProffSyrup — ООО «ПРОФСИРОП»", inn: "", city: "Москва",
      segment: "Пищевое производство · сиропы", source: "Импорт базы", manager: 14,
      stage: "Запрошены данные", nextAction: "", nextActionDate: "",
      lastTouch: "2026-07-05", comment: "Письмо отправлено в отдел закупок, ответа не было." },
    { id: "CL006", company: "ООО «Сиропы МО»", inn: "", city: "Московская область",
      segment: "Сиропы", source: "Сайт", manager: 15,
      stage: "Новый лид", nextAction: "Найти контакт закупок", nextActionDate: "2026-07-18",
      lastTouch: "2026-07-05", comment: "Найден сайт, нужен контакт закупок." },
    { id: "CL007", company: "Новбытхим", inn: "", city: "—",
      segment: "Бытовая химия", source: "Холодный поиск", manager: 16,
      stage: "Первичный контакт", nextAction: "Дождаться реакции на письмо", nextActionDate: "2026-07-19",
      lastTouch: "2026-07-08", comment: "Письмо отправлено, ждём реакцию." },
    { id: "CL008", company: "ООО «Торговый Дом Шоколада»", inn: "", city: "Москва / МО",
      segment: "Продукты питания · шоколад", source: "Импорт базы", manager: 14,
      stage: "Первичный контакт", nextAction: "", nextActionDate: "",
      lastTouch: "2026-07-03", comment: "Анжела направила к Камиле, письмо отправлено Камиле." },
    { id: "CL009", company: "ООО «Микояновский мясокомбинат»", inn: "", city: "Москва",
      segment: "Мясная отрасль", source: "Импорт базы", manager: 17,
      stage: "Выявлена потребность", nextAction: "Проверить ответ отдела закупок", nextActionDate: "2026-07-13",
      lastTouch: "2026-07-03", comment: "Письмо отправлено в отдел закупок 03.07." },
    { id: "CL010", company: "ИП Иванов", inn: "", city: "—",
      segment: "Мёд, консервация", source: "Повторные заказы", manager: 10,
      stage: "Клиент", nextAction: "Проконтролировать сроки печати", nextActionDate: "2026-07-18",
      lastTouch: "2026-07-01", comment: "Активный клиент, регулярные заказы." },
    { id: "CL011", company: "ООО Кимберли", inn: "", city: "—",
      segment: "Этикетки PP", source: "Повторные заказы", manager: 10,
      stage: "Клиент", nextAction: "", nextActionDate: "",
      lastTouch: "2026-06-20", comment: "Заказ выполнен, следующего касания пока нет." },
    { id: "CL012", company: "ИП Абишев", inn: "", city: "—",
      segment: "Мёд", source: "Повторные заказы", manager: 11,
      stage: "Клиент", nextAction: "Уточнить оплату по заказу QT8R6D", nextActionDate: "2026-07-10",
      lastTouch: "2026-06-22", comment: "Есть просроченная оплата." },
    { id: "CL013", company: "ООО Дары Природы", inn: "", city: "—",
      segment: "Варенье, косметика", source: "Повторные заказы", manager: 12,
      stage: "Клиент", nextAction: "Согласовать новый нож под мыло ручной работы", nextActionDate: "2026-07-20",
      lastTouch: "2026-07-02", comment: "Срочный заказ на мыло, нужен лазер." },
    { id: "CL014", company: "ООО СеверПродукт", inn: "", city: "—",
      segment: "Замороженные ягоды, консервация", source: "Повторные заказы", manager: 10,
      stage: "Клиент", nextAction: "Подтвердить оплату по заказу PR4T7X", nextActionDate: "2026-07-19",
      lastTouch: "2026-06-28", comment: "Договор постоянный, работаем регулярно." },
  ];

  // --- CRM: история касаний, вопросы, задачи — всё привязано к clientId ---
  let history = [
    { id: "H001", clientId: "CL001", type: "Контакт", author: "Овечкин Константин", role: "Менеджер", date: "11.07.2026 · 09:20", text: "Возник контакт с клиентом. Обсудили потребность в этикетках для попкорна и возможные сроки." },
    { id: "H002", clientId: "CL001", type: "КП", author: "Овечкин Константин", role: "Менеджер", date: "11.07.2026 · 10:05", text: "Сделан предварительный расчёт, отправлены варианты по тиражам. Клиенту подходит цена и сроки." },
    { id: "H003", clientId: "CL001", type: "Договор", author: "Алексеева Яна", role: "Бухгалтер", date: "11.07.2026 · 11:10", text: "Договор согласован и прикреплён к карточке клиента." },
    { id: "H004", clientId: "CL004", type: "КП", author: "Лукина Римма", role: "Менеджер", date: "11.07.2026 · 09:00", text: "Отправлено коммерческое предложение по трём вариантам тиража." },
    { id: "H005", clientId: "CL003", type: "Контакт", author: "Шаповалов Дмитрий", role: "Менеджер", date: "12.07.2026 · 14:20", text: "Созвонились, обсудили качество печати и условия поставки." },
  ];

  // --- вопросы (ТЗ §10.17): authorId/addresseeId — конкретные сотрудники,
  // to — роли-получатели (для отображения), orderId — необязательная связь ---
  let questions = [
    { id: "ВОП-0048", clientId: "CL001", orderId: null, title: "Уточнить намотку по бланку", text: "В бланке указана одна намотка, а в комментарии менеджера другая. Нужно подтвердить перед запуском.", stage: "Бланк согласования", to: ["Менеджер", "Дизайнер", "Технолог"], authorId: 10, addresseeId: 20, status: "open" },
    { id: "ВОП-0049", clientId: "CL001", orderId: null, title: "Нужен новый нож?", text: "Размер похож на архивный, но нужно проверить зазор и ручьи перед заказом нового ножа.", stage: "Нож", to: ["Бухгалтер", "Дизайнер"], authorId: 10, addresseeId: 45, status: "waiting" },
    { id: "ВОП-0050", clientId: "CL013", orderId: "AP9M3L", title: "Проверить Pantone", text: "На макете есть Pantone, но расход не подтверждён. Нужно уточнить у клиента или дизайнера.", stage: "Формы", to: ["Дизайнер", "Технолог"], authorId: 12, addresseeId: 20, status: "in_progress" },
  ];

  // --- задачи (ТЗ §10.16): assigneeId — конкретный исполнитель, role — его роль
  // на момент назначения (для фильтров), orderId — необязательная связь ---
  let tasks = [
    { id: "ЗАД-0001", clientId: "CL002", orderId: null, title: "Подготовить расчёт по тиражам", description: "", dueDate: "2026-07-17", status: "new", assigneeId: 11, role: "manager", priority: "Средний", createdBy: 1 },
    { id: "ЗАД-0002", clientId: "CL001", orderId: null, title: "Проверить подписанный бланк", description: "", dueDate: "2026-07-16", status: "new", assigneeId: 10, role: "manager", priority: "Высокий", createdBy: 1 },
    { id: "ЗАД-0003", clientId: null, orderId: "DS2K8P", title: "Проверить макет", description: "", dueDate: "2026-07-16", status: "new", assigneeId: 20, role: "designer", priority: "Средний", createdBy: 10 },
    { id: "ЗАД-0004", clientId: "CL001", orderId: null, title: "Уточнить намотку", description: "Связано с вопросом ВОП-0048.", dueDate: "2026-07-16", status: "in_progress", assigneeId: 10, role: "manager", priority: "Высокий", createdBy: 1 },
    { id: "ЗАД-0005", clientId: null, orderId: null, title: "Согласовать отсрочку", description: "", dueDate: "2026-07-18", status: "waiting", assigneeId: 1, role: "director", priority: "Средний", createdBy: 10 },
    { id: "ЗАД-0006", clientId: null, orderId: null, title: "Импорт базы клиентов", description: "Создано 3 карточки.", dueDate: "2026-07-10", status: "done", assigneeId: 10, role: "manager", priority: "Низкий", createdBy: 10 },
  ];

  // --- новости компании (ТЗ §10.26) ---
  let news = [
    { id: "N1", title: "Новый порядок принятия заказа в работу", text: "Заказ передаётся в работу только после договора, согласованной спецификации, подписанного бланка и полного пакета файлов.", author: "Кылычев Алик", authorRole: "director", audience: "all", createdAt: "16 июл, 09:00", readBy: [] },
    { id: "N2", title: "Актуальные условия по спецификациям", text: "В спецификации обязательно фиксируем количество, цену с НДС и доставкой, срок поставки и адрес доставки.", author: "Алексеева Яна", authorRole: "accountant", audience: "all", createdAt: "15 июл, 14:00", readBy: [] },
    { id: "N3", title: "Обновлены базовые данные калькулятора", text: "В расчётах используется актуальная таблица бухгалтера и новая точность отображения для менеджеров.", author: "Система", authorRole: "director", audience: "all", createdAt: "30 июн, 10:00", readBy: [10, 20] },
  ];

  // --- события календаря (ТЗ §10.24) ---
  let events = [
    { id: "EV1", title: "Позвонить ООО «Фрутти» — повторное касание", type: "call", date: "2026-07-13", time: "10:30", assigneeId: 10, clientId: "CL004", orderId: null, done: false },
    { id: "EV2", title: "Подготовить спецификацию к договору", type: "task", date: "2026-07-15", time: "12:00", assigneeId: 10, clientId: "CL001", orderId: null, done: false },
    { id: "EV3", title: "Сдать макет на согласование", type: "order_deadline", date: "2026-07-16", time: "17:00", assigneeId: 20, clientId: null, orderId: "DS2K8P", done: false },
    { id: "EV4", title: "Отгрузка заказа PR4T7X", type: "shipment", date: "2026-07-17", time: "15:00", assigneeId: 60, clientId: null, orderId: "PR4T7X", done: false },
    { id: "EV5", title: "Проверить оплату по заказу QT8R6D", type: "payment", date: "2026-07-18", time: "09:00", assigneeId: 45, clientId: null, orderId: "QT8R6D", done: false },
    { id: "EV6", title: "Согласовать список горячих клиентов", type: "task", date: "2026-07-16", time: "09:30", assigneeId: 1, clientId: null, orderId: null, done: false },
  ];

  // --- справочники — берутся из reference_data.js (подключён раньше store.js) ---
  const materials         = MATERIALS;
  const lamination        = LAMINATION;
  const inks               = INKS;
  const machines           = MACHINES;
  const orderTypes         = ORDER_TYPES;
  const documentTypes      = DOCUMENT_TYPES;
  const notificationTypes  = NOTIFICATION_TYPES;
  const knives             = KNIVES;
  const clientNames        = CLIENTS;
  const funnelStages       = FUNNEL_STAGES;
  const materialStock      = MATERIAL_STOCK;
  const inkStock           = INK_STOCK;
  const smallRunThreshold  = SMALL_RUN_THRESHOLD;
  const popularSizes       = POPULAR_SIZES;
  const materialUseReasons = MATERIAL_USE_REASONS;
  const taskStatuses       = TASK_STATUSES;
  const questionStatuses   = QUESTION_STATUSES;
  const eventTypes         = EVENT_TYPES;

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

  // paid — производное поле (см. CLAUDE.md, Фаза 6): руками не выставляется,
  // пересчитывается здесь при каждом изменении paidAmount/clientPrice
  function recalcPaid(order) {
    order.paid = order.clientPrice != null && order.paidAmount >= order.clientPrice;
    return order;
  }
  orders.forEach(recalcPaid);

  function addPayment(orderId, payment) {
    const order = getOrderById(orderId);
    if (!order) return null;
    const entry = {
      id: "PMT-" + String(order.payments.length + 1).padStart(4, "0"),
      amount: payment.amount, date: payment.date, method: payment.method,
      who: payment.who, note: payment.note || "",
    };
    order.payments.push(entry);
    order.paidAmount += entry.amount;
    recalcPaid(order);
    return entry;
  }

  function removePayment(orderId, paymentId) {
    const order = getOrderById(orderId);
    if (!order) return null;
    const i = order.payments.findIndex(p => p.id === paymentId);
    if (i === -1) return null;
    const [removed] = order.payments.splice(i, 1);
    order.paidAmount -= removed.amount;
    recalcPaid(order);
    return removed;
  }

  function setDeferral(orderId, deferral) {
    const order = getOrderById(orderId);
    if (order) order.deferral = deferral;
    return order;
  }

  function clearDeferral(orderId) {
    const order = getOrderById(orderId);
    if (order) order.deferral = null;
    return order;
  }

  // period: "month" | "quarter" | "year" | "all" — считает по отгруженным/завершённым (ready, done)
  function getFinanceSummary(period) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const from = new Date(today);
    if (period === "month") from.setMonth(from.getMonth() - 1);
    else if (period === "quarter") from.setMonth(from.getMonth() - 3);
    else if (period === "year") from.setFullYear(from.getFullYear() - 1);
    else from.setFullYear(1970);

    const included = orders.filter(o => {
      if (!["ready", "done"].includes(o.status)) return false;
      if (!o.shipDate) return false;
      const [y, m, d] = o.shipDate.split("-").map(Number);
      return new Date(y, m - 1, d) >= from;
    });

    const revenue = included.reduce((s, o) => s + (o.clientPrice || 0), 0);
    const cost = included.reduce((s, o) => s + (o.costPrice || 0), 0);
    const paid = included.reduce((s, o) => s + (o.paidAmount || 0), 0);
    return { revenue, cost, profit: revenue - cost, paid, debt: revenue - paid, ordersCount: included.length };
  }

  let blankCounter = 5;
  function nextBlankId() {
    blankCounter++;
    return "BLK-" + String(blankCounter).padStart(4, "0");
  }

  function createBlank(orderId, data) {
    const order = getOrderById(orderId);
    if (!order) return null;
    order.blank = {
      id: nextBlankId(), version: 1, status: "draft",
      sentAt: null, signedAt: null, signedBy: "",
      fileName: data.fileName || "", note: data.note || "",
    };
    return order.blank;
  }

  function sendBlank(orderId, today) {
    const order = getOrderById(orderId);
    if (!order || !order.blank || order.blank.status !== "draft") return null;
    order.blank.status = "sent";
    order.blank.sentAt = today;
    return order.blank;
  }

  function signBlank(orderId, { signedBy, fileName, today }) {
    const order = getOrderById(orderId);
    if (!order || !order.blank || order.blank.status !== "sent") return null;
    order.blank.status = "signed";
    order.blank.signedAt = today;
    order.blank.signedBy = signedBy;
    if (fileName) order.blank.fileName = fileName;
    return order.blank;
  }

  function rejectBlank(orderId, reason) {
    const order = getOrderById(orderId);
    if (!order || !order.blank || order.blank.status !== "sent") return null;
    order.blank.status = "rejected";
    order.blank.note = reason;
    return order.blank;
  }

  function reviseBlank(orderId, data) {
    const order = getOrderById(orderId);
    if (!order || !order.blank) return null;
    order.blankHistory.push(order.blank);
    order.blank = {
      id: order.blank.id, version: order.blank.version + 1, status: "draft",
      sentAt: null, signedAt: null, signedBy: "",
      fileName: data.fileName || "", note: data.note || "",
    };
    return order.blank;
  }

  function getBlanksByStatus(status) {
    return orders.filter(o => o.blank && o.blank.status === status);
  }

  // заказы с непогашенным остатком, ближайший срок отсрочки — вперёд
  function getReceivables() {
    return orders
      .filter(o => o.clientPrice != null && o.clientPrice - o.paidAmount > 0)
      .sort((a, b) => (a.deferral?.until || a.shipDate || "").localeCompare(b.deferral?.until || b.shipDate || ""));
  }

  // связь клиент → заказы по совпадению customer === company (без clientId в заказе)
  function getOrdersByClient(company) {
    return orders.filter(o => o.customer === company);
  }

  function getStaff() {
    return staff;
  }

  // --- репозиторий CRM: клиенты, история, вопросы, задачи ---
  function getClients() {
    return clients;
  }
  function getClientById(id) {
    return clients.find(c => c.id === id) || null;
  }
  function saveClient(client) {
    if (!client.id) client.id = "CL" + String(Date.now()).slice(-8);
    const i = clients.findIndex(c => c.id === client.id);
    if (i === -1) {
      clients.push(client);
    } else {
      clients[i] = client;
    }
    return client;
  }

  function getHistory(clientId) {
    return clientId ? history.filter(h => h.clientId === clientId) : history;
  }
  function addHistory(entry) {
    if (!entry.id) entry.id = "H" + String(Date.now()).slice(-8);
    history.push(entry);
    return entry;
  }

  function getQuestions(clientId) {
    return clientId ? questions.filter(q => q.clientId === clientId) : questions;
  }
  function addQuestion(question) {
    if (!question.id) question.id = "ВОП-" + String(50 + questions.length).padStart(4, "0");
    questions.unshift(question);
    return question;
  }

  function getTasks(clientId) {
    return clientId ? tasks.filter(t => t.clientId === clientId) : tasks;
  }
  function getTaskById(id) {
    return tasks.find(t => t.id === id) || null;
  }
  function addTask(task) {
    if (!task.id) task.id = "ЗАД-" + String(1 + tasks.length).padStart(4, "0");
    tasks.push(task);
    return task;
  }

  // --- репозиторий новостей ---
  function getNews() {
    return news;
  }
  function addNews(item) {
    if (!item.id) item.id = "N" + (1 + news.length);
    item.readBy = item.readBy || [];
    news.unshift(item);
    return item;
  }
  function markNewsRead(id, staffId) {
    const item = news.find(n => n.id === id);
    if (item && staffId && !item.readBy.includes(staffId)) item.readBy.push(staffId);
    return item;
  }

  // --- репозиторий календаря ---
  function getEvents() {
    return events;
  }
  function addEvent(event) {
    if (!event.id) event.id = "EV" + (1 + events.length);
    events.push(event);
    return event;
  }
  function toggleEventDone(id) {
    const event = events.find(e => e.id === id);
    if (event) event.done = !event.done;
    return event;
  }

  // --- репозиторий справочников ---
  function getMaterials()         { return materials; }
  function getLamination()        { return lamination; }
  function getInks()              { return inks; }
  function getMachines()          { return machines; }
  function getOrderTypes()        { return orderTypes; }
  function getDocumentTypes()     { return documentTypes; }
  function getNotificationTypes() { return notificationTypes; }
  function getKnives()            { return knives; }
  function getClientNames()       { return clientNames; }
  function getFunnelStages()      { return funnelStages; }
  function getMaterialStock()     { return materialStock; }
  function getInkStock()          { return inkStock; }
  function getSmallRunThreshold() { return smallRunThreshold; }
  function getPopularSizes()      { return popularSizes; }
  function getMaterialUseReasons(){ return materialUseReasons; }
  function getTaskStatuses()      { return taskStatuses; }
  function getQuestionStatuses()  { return questionStatuses; }
  function getEventTypes()        { return eventTypes; }

  return {
    getOrders, getOrderById, saveOrder, getOrdersByClient, getStaff,
    recalcPaid, addPayment, removePayment, setDeferral, clearDeferral,
    getFinanceSummary, getReceivables,
    createBlank, sendBlank, signBlank, rejectBlank, reviseBlank, getBlanksByStatus,
    getDocuments, addDocument, reviseDocument, archiveDocument, getDocumentVersions, getDocumentTypes,
    getNotifications, addNotification, markRead, markAllRead, getUnreadCount, getNotificationTypes,
    getMaterials, getLamination, getInks, getMachines, getOrderTypes,
    getKnives, getClientNames, getFunnelStages, getMaterialStock, getInkStock,
    getSmallRunThreshold, getPopularSizes, getMaterialUseReasons,
    getTaskStatuses, getQuestionStatuses, getEventTypes,
    getClients, getClientById, saveClient,
    getHistory, addHistory,
    getQuestions, addQuestion,
    getTasks, getTaskById, addTask,
    getNews, addNews, markNewsRead,
    getEvents, addEvent, toggleEventDone,
  };

})();
