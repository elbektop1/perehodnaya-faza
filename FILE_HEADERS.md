# FILE_HEADERS.md — шапки-комментарии js-файлов

> Вынесено из начала js-файлов, чтобы убрать их из кода, но не потерять.
> Здесь записано, какой модуль от каких функций/файлов зависит — карта
> зависимостей проекта. Пригодится при рефакторинге и переходе на бэкенд.

---

## store.js
```
store.js — единый слой данных В ПАМЯТИ (без localStorage).
Функции-репозитории — единственная точка доступа к данным.
Тело функций позже меняется на fetch('/api/...') без правки UI (MASTER_PLAN.md §2).
Подключать после reference_data.js (справочники читаются оттуда один раз при
загрузке и хранятся здесь как приватное поле стора, не как глобальные const).
```

## orders.js
```
orders.js — FSM заказов, перенесено из корневого app.js (Фаза 2).
Таблицы и guard'ы — без изменений смысла. Данные — через Store (store.js),
роль читается напрямую из #roleSelect (тот же паттерн, что в shell.js).
```

## finance.js  (Фаза 6)
```
finance.js — Фаза 6: оплаты, отсрочки, сводка по деньгам.
Использует Store (store.js), esc/roleNames/navTo (shell.js),
openModal/closeModal/getStatus/staffName/formatMoney/formatShortDate/
orderPaymentSummary/todayIso/canShip/nowLabel/getCurrentRole (orders.js),
formatDate/getCurrentStaffId (clients.js/shell.js).
```

## clients.js  (Фаза 3)
```
clients.js — CRM: клиенты, воронка, карточка клиента (Фаза 3).
Использует Store (store.js), esc/navTo/roleNames (shell.js),
openModal/closeModal/staffByRole/getStatus/nowLabel (orders.js).
```

## tasks.js  (Фаза 4, ТЗ §10.16)
```
tasks.js — сквозной раздел «Задачи».
Использует Store (store.js), esc/getCurrentStaffId (shell.js),
getCurrentRole/staffByRole/staffName/nowLabel/openModal (orders.js),
parseDateStr/formatDate/managerName (clients.js).
```

## questions.js  (Фаза 4, ТЗ §10.17)
```
questions.js — сквозной раздел «Вопросы».
Использует Store (store.js), esc/getCurrentStaffId (shell.js),
getCurrentRole/staffByRole/staffName/formatPersonName/nowLabel (orders.js),
clientCompany/questionStatusLabel/nowStamp (clients.js).
```

## news.js  (Фаза 4, ТЗ §10.26)
```
news.js — сквозной раздел «Новости».
Использует Store (store.js), esc/getCurrentStaffId/roleNames (shell.js),
getCurrentRole/staffName/nowLabel/openModal/closeModal (orders.js).
```

## calendar.js  (Фаза 4, ТЗ §10.24)
```
calendar.js — сквозной раздел «Календарь».
Использует Store (store.js), esc/getCurrentStaffId (shell.js),
staffByRole/staffName/formatPersonName/openModal/closeModal/nowLabel (orders.js),
parseDateStr/formatDate (clients.js).
```

## reference_data.js
```
СПРАВОЧНИКИ — реальные данные из калькулятора заказчика.
Используются в форме создания заказа (выпадающие списки).
Позже станут таблицами в PostgreSQL.
```

## production.js  (Фаза 7)
```
production.js — производственный план и очередь печати.
Использует Store (store.js), esc/roleNames/navTo/getCurrentStaffId (shell.js),
getCurrentRole/staffName/renderShipDate/getStatus/getAvailableActions/doAction/
renderOrders/nowLabel (orders.js). Подключён после finance.js, требует
assets/sortable.min.js (необязателен — без него доступны только кнопки
«выше/ниже»).
```

## approvals.js  (Фаза 8)
```
approvals.js — бланки согласования: жизненный цикл (черновик → отправлен →
подписан/отклонён), версионность подписанных бланков, guard запуска в
производство (openBlankBlockedModal, вызывается из orders.js/doAction),
производственный пакет заказа. Использует Store (store.js),
esc/roleNames/navTo/getCurrentRole (shell.js/orders.js), openModal/
closeModal/staffName/formatShortDate/parseShipDate/todayIso/nowLabel
(orders.js), clientFiles/renderClientFiles (shell.js), renderClientOrders
(clients.js), renderProduction (production.js) — последние три вызываются
через typeof-проверку. orders.js обращается к openBlankBlockedModal/
orderBlankLineHtml/openProductionPackageModal в обратную сторону
(тот же приём, что finance.js↔orders.js в Фазе 6), поэтому подключён
последним.
```

## documents.js  (Фаза 9)
```
documents.js — единый реестр документов (договоры, спецификации, счета,
УПД, бланки согласования, производственные пакеты, письма, прочее):
загрузка, версионность (reviseDocument/archiveDocument, как reviseBlank
в Фазе 8), экран «Документы», блок «Документы заказа» на карточке
(orders.js — typeof-guard), вкладка «Файлы» карточки клиента (перенесена
из shell.js целиком — источник данных теперь Store.getDocuments, а не
отдельный массив), синхронизация подписанных бланков из approvals.js
(syncBlankToDocuments). Использует Store (store.js), esc/roleNames/
getCurrentStaffId (shell.js), openModal/closeModal/staffName/
formatShortDate/todayIso/nowLabel/getCurrentRole (orders.js), currentClient/
nowStamp (clients.js — вызываются через typeof, т.к. этот файл грузится
последним из всех). orders.js/clients.js/approvals.js в ответ обращаются
к его функциям (getOrderDocumentsHtml/renderClientFiles/
syncBlankToDocuments) тоже через typeof — тот же приём кросс-файловых
вызовов, что и в Фазе 8 (finance.js↔orders.js, approvals.js↔orders.js).
```

## notifications.js  (Фаза 10)
```
notifications.js — адресный центр уведомлений: колокольчик в шапке,
выпадающая панель, экран «Уведомления». Уведомления создаются в момент
события в других файлах через тонкие хук-функции (notifyNewTask/
notifyNewQuestion/notifyOrderStatusChange/notifyNewsPublished/
notifyBlankSent), вызываемые оттуда через typeof-guard (этот файл
подключён последним). Deadline/payment — вычисляются функцией
computeLiveWarnings() при рендере, не хранятся в Store. Использует
Store (store.js), esc/roleNames/getCurrentStaffId (shell.js),
getCurrentRole/staffName/navTo/getStatus/nowLabel/parseShipDate/
isPaymentOverdue (orders.js), audienceStaff (news.js).
```

## shell.js
> Шапки-комментария нет.

## app.js
> Шапки-комментария нет (корневой прототип, вне светлой сборки).
