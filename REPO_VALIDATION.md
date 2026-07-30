# REPO_VALIDATION.md — Сверка документов с реальным кодом

> **Дата:** 2026-07-15. Проверено по подключённой папке `D:\Desktop\Заказ`.
> Ветка на момент проверки: **`my-new-branch`**.
> Легенда: ✅ подтверждено кодом · ❌ опровергнуто · ⚠️ скорректировано.
> Все ссылки — `файл:строка`.

---

## 0. Главный вывод

Анализ Jules **завышен и местами не соответствует коду**. Реальный корневой проект
**проще и честнее**, чем его описание: это не «почти готовая система с 29 экранами и
PWA», а рабочий SPA-прототип с **7 статусами**, **~15 страницами**, **9 ролями** и
справочниками в массивах. 29 экранов, gate-модель, «ВОП-XXXX», карточка клиента,
готовый PWA — всё это существует **только в `client_reference`** (эталон-цель), а не
в корне. Мои четыре документа, построенные на тексте Jules, требуют правок —
конкретика ниже.

---

## 1. Ветки репозитория (ответ на твой вопрос)

```
* my-new-branch            ← текущая
  test-branch
  remotes/origin/main
  remotes/origin/my-new-branch
  remotes/origin/test-branch
  worktree-agent-ade84998008014ace   ← рабочее дерево агента (вероятно, Jules)
```
`main` есть только на origin, локально не выгружен. Есть отдельный worktree агента —
там могли создаваться .md Jules.

---

## 2. Структура (факт)

| Путь | Факт | Против Jules |
|:--|:--|:--|
| `app.js` (144 КБ) | Корень — вся бизнес-логика | ok |
| `calculator.html` (312 КБ) | Калькулятор, PIN есть (16 упоминаний) | ✅ PIN подтверждён |
| `reference_data.js` (8.7 КБ) | Справочники: MATERIALS, KNIVES, MACHINES, стоки | ⚠️ это массивы, не БД |
| `style.css` (30 КБ) | Стиль корня | ok |
| `manifest.webmanifest`, `service-worker.js`, `offline.html` | **0 байт — пустые заглушки** | ❌ Jules: «PWA готов в корне» — неверно |
| `ART-LINE_OS_v1.6/client_reference/` | Эталон: `app.js` 58 КБ, `styles.css` 87 КБ, **рабочие** PWA-файлы (896/1275/910 б), `index.html` 224 КБ | ✅ вот здесь 29 экранов и PWA |
| `assets/` | Пусто | — |

**Вывод:** PWA-файлы для миграции берём из `client_reference`, корневые пусты.

---

## 3. Правки к `FSM_ANALYSIS.md`

Источник истины: `app.js:202-256`.

### 3.1. Статусы — ❌ было 13 (реконструкция), ✅ реально **7**
`app.js:202-210`:
```
new → design → rework → approval → production → ready → done
```
❌ Не существует: `lead`, `draft`, `calculation`, `specification`, `approval_layout`,
`ready_to_launch`, `accepted`, `postpress`, `shipment`, `cancelled`, `on_hold`.
Мой реконструированный жизненный цикл был переусложнён.

### 3.2. «Принятие в работу» — ⚠️ это НЕ статус, а флаг
`app.js:221,226,235-236` — приём оформлен как **self-loop** с `accept:true` и
записью в поле заказа `acceptedBy` (`app.js:273`). Кнопка «Готово к отгрузке»
(`production → ready`) имеет `requiresAccepted:true` (`app.js:238`) и появляется
только если `order.acceptedBy != null` (`app.js:597`). ✅ Инвариант подтверждён, но
моделируется флагом, а не отдельным состоянием `accepted`.

### 3.3. Реальная таблица переходов (проверено)
| Из | Куда | Роль | Флаги |
|:--|:--|:--|:--|
| new | design | manager | assignTo: designer |
| new | production | manager | assignTo: worker (повтор минуя дизайнера) |
| design | design | designer | accept |
| design | approval | designer | primary |
| design | new | designer | comment, problem |
| rework | rework | designer | accept |
| rework | approval | designer | primary |
| approval | production | manager | assignTo: worker |
| approval | rework | manager | comment |
| approval | production | production_manager | assignTo: worker |
| production | production | worker / production_manager | accept |
| production | ready | worker | **requiresAccepted**, variant ok |
| production | approval | worker | comment, problem |
| ready | done | manager | variant ok |
| done | — | — | терминальный |

### 3.4. Кто меняет статус — ⚠️ только 4 роли
В `TRANSITIONS` фигурируют **только** `manager`, `designer`, `worker`,
`production_manager`. ❌ Мои §3-предположения про `economist`, `accountant`,
`director`, `assistant`, `technologist` как акторов переходов — неверны: они заказы
по статусам не двигают.

### 3.5. Guards — ⚠️ реально только два
✅ `requiresAccepted` (`app.js:238`), ✅ `comment:true` на проблемных возвратах
(`app.js:223,231,241`). ❌ `gateChecklist` (5 шлюзов), `financeClearance`,
`materialsAvailable` — **в корне отсутствуют**. Gate из 5 чекбоксов — это чисто
`client_reference`. Значит §6 (слияние моделей) остаётся валидной **как план**, но в
корне сливать пока нечего — gate добавляется при интеграции эталона.

---

## 4. Правки к `ROLE_PERMISSION_MATRIX.md`

Источник: `app.js:2-199`, `979-980`; `client_reference/app.js:1,33-40`.

### 4.1. Роли — ⚠️ реально **9**, без `technologist`
`ROLE_LABELS` (`app.js:77-87`): `director, assistant, manager, designer, economist,
accountant, worker, production_manager, admin`.
❌ Роли `technologist` в корне **нет** — это роль эталона. В эталоне 6 ролей
(`client_reference/app.js:1`): `manager, designer, technologist, printer, accountant,
leader`. Значит моя «10-я целевая роль technologist» — это цель миграции, а не факт
корня. ✅ `economist` и `assistant` реальны и раздельны — как ты и просил сохранить.
✅ `assistant` прямо помечен «урезанный доступ — без финансов» (`app.js:6`).

### 4.2. Соответствие ролей корень↔эталон (факт)
| Корень (9) | Эталон (6) | Примечание |
|:--|:--|:--|
| director | leader | ✅ |
| admin | leader (+эталон нет отдельного admin) | admin отдельно только в корне |
| assistant | — | нет аналога в эталоне (сохраняем) |
| manager | manager | ✅ |
| designer | designer | ✅ |
| economist | — | нет аналога (сохраняем отдельно) |
| production_manager | technologist? | ⚠️ ближайший, но семантика иная (сборщик форм) |
| accountant | accountant | ✅ |
| worker | printer | ✅ |

### 4.3. Доступ к марже/себестоимости — ❌ в корне это НЕ PIN
`app.js:979-980`:
```js
canEditClientPrice = ["manager","economist","director"]
canEditCostPrice   = ["economist","director"]
```
Гейт **ролевой** (поля `disabled`), а не PIN. ❗ Важно: `accountant` **не** входит ни
в редактирование цены клиента, ни себестоимости — против моей матрицы, где я дал
бухгалтеру полный доступ к марже. Отдельная страница `earnings` («Выручка,
себестоимость, прибыль») доступна по меню только `director` (`app.js:101`).
PIN (`app.js:16 упом. в calculator.html`) живёт **внутри калькулятора**, а не в
карточке заказа. То есть механизма два, в разных местах — надо развести в матрице.

### 4.4. Реальные страницы (меню) — ⚠️ ~15, не 29
`MENU_BY_ROLE` (`app.js:92-159`): `orders, dashboard(Загрузка), staff, archive,
materials-report, proposals, finance, earnings, calculator, chat, designers, workers,
new(модалка), production-plan, users`. 29 экранов из матрицы — это разделы эталона
(`roleVisibility`, `client_reference/app.js:33-40`), цель миграции.

### 4.5. Фильтр видимости заказов (факт, добавить в матрицу)
`ROLE_ORDER_FILTER` (`app.js:162-172`): `designer` видит только `["design","rework"]`,
`worker` — только `["production"]`, остальные — все. ✅ Совпадает с моим `◐ scope:own`.

---

## 5. Правки к `ENTITY_MODEL.md`

Источник: `app.js:269-433`, `reference_data.js`.

### 5.1. `orders` — ⚠️ реальные поля (плоские, не вложенные)
Факт (`app.js:271-279`): `id`(6 симв.), `title`, `customer`(строка), `status`,
`assignee`(один id), `acceptedBy`, `hasProblem`, `paid`, `urgent`, `priority`,
`materials[]`, `files[]`, `customerEmail`, `knifeId`(один), `cuttingType`,
`needNewKnife`, `createdBy`, `paymentDue`, `clientPrice`, `costPrice`, `runLength`,
`orderType`, `labelSize`, `material`(строка), `lamination`(строка), `machine`(строка),
`shipDate`, `manager`, `history[]`.
❌ Мои выдумки: `spec{}`-объект, `gate{}`, `assigneeDesignerId`/`assigneePrinterId`
(реально один `assignee` + `acceptedBy`), `machineId`/`knifeIds`-массивы
(реально `machine`-строка и один `knifeId`), `financeClearance`. Заменить на факт.

### 5.2. `clients` — ❌ в корне отдельной сущности нет
`customer` — просто строка в заказе; `CLIENTS` (`reference_data.js:135`) — массив
строк для автодополнения. Карточка клиента — концепт эталона. Jules прав, что экрана
клиентов в корне нет.

### 5.3. `questions` («ВОП-XXXX») — ❌ в корне отсутствует
Grep по `app.js` — нет `questions`/`ВОП`. Это сущность `client_reference`. Проблемы в
корне — это флаг `hasProblem` + `comment` в истории, не отдельная сущность.

### 5.4. `employees` (STAFF) — ⚠️ минимальные поля
Факт (`app.js:2-43`): только `id, name, role, photo`. ❌ Моих `login`, `tempPassword`,
`load`, `specialization`, `active` в корне нет (это поля кабинета эталона). Значит и
security-долг «tempPassword в открытом виде» относится к эталону, не к корню.

### 5.5. `materials` / `knives` / `machines` — ⚠️ массивы, не таблицы
`reference_data.js`: `MATERIALS` (строки, :8), `LAMINATION`/`INKS` (строки),
`MACHINES` (строки, :65 — Gallus 200/160, Weigang 450, Bengraphic 330, Labelsmart 325,
Montax 370, Arojet 340, Darui лазерный), `KNIVES` (объекты `{id,name,width,height,
notes}`, :101), `MATERIAL_STOCK`/`INK_STOCK` (остатки), `SMALL_RUN_THRESHOLD=3000`,
`POPULAR_SIZES`. ❌ Мои `machines.queue/capacity/supportedMaterialIds`,
`knives.techCard/wearCost/shape` — в корне отсутствуют. ✅ Но комментарии в коде прямо
пишут «позже станут таблицами в PostgreSQL» (`reference_data.js:4`) — т.е. под API
проект осознанно готовят, моё направление верное.

---

## 6. Правки к `CSS_MIGRATION_ANALYSIS.md`

Реальный дифф `style.css` (199 классов) vs `client_reference/styles.css` (433 класса).

### 6.1. Конфликтующие классы (факт, 10 значимых)
`.active`, `.badge`, `.done`, `.eyebrow`, `.field-label`, `.hidden`, `.muted`,
`.overdue`, `.sidebar`, `.topbar`.
✅ Мой прогноз подтвердился по `.active`, `.sidebar`, `.topbar`. ⚠️ `.section`/
`.active-section` в самих CSS пересекаются меньше, чем ожидалось (в корне 5 упоминаний
`.section/.active`, в эталоне 17) — но переключение секций всё равно на этих классах,
проверить в JS.

### 6.2. Конфликтующие CSS-переменные (факт, 7)
`--accent`, `--bg`, `--cyan`, `--green`, `--red`, `--shadow`, `--yellow` — одинаковые
имена в обоих файлах, значения почти наверняка разные. ✅ Токенизация (§3 шаг 1 моего
документа) обязательна именно из-за них.

### 6.3. Стратегия — остаётся в силе
`@layer` + токенизация переменных подтверждают себя на реальных данных. PWA: `ASSETS`
брать из **рабочего** `client_reference/service-worker.js` (корневой пуст).

---

## 7. Что скорректировать в 4 документах (сводка действий)

1. **FSM_ANALYSIS.md** — заменить 13 статусов на реальные 7; убрать `accepted` как
   статус (сделать флаг `acceptedBy`); оставить акторами только 4 роли; guards — только
   `requiresAccepted` + `comment`; gate пометить как «добавляется при интеграции эталона».
2. **ROLE_PERMISSION_MATRIX.md** — база 9 ролей (без `technologist` в корне); маржа —
   ролевой гейт (`economist`/`director`), не PIN; бухгалтер цену/себестоимость не
   правит; заменить 29 экранов на реальные ~15 страниц + отдельно эталонные разделы.
3. **ENTITY_MODEL.md** — реальные плоские поля `orders`; убрать `clients`/`questions`
   как сущности корня (пометить как цель эталона); `employees` = id/name/role/photo;
   materials/knives/machines — массивы из `reference_data.js`.
4. **CSS_MIGRATION_ANALYSIS.md** — вписать фактические 10 классов и 7 переменных;
   ASSETS из client_reference.

---

## 8. Открытые вопросы к тебе (решить до правок/миграции)

1. `admin` и `assistant` в эталонной 6-ролевой модели аналогов не имеют. Оставляем как
   кастомные роли поверх `roleVisibility` эталона? (по умолчанию — да)
2. `production_manager` (сборщик форм) мапить в эталонного `technologist` или держать
   отдельной 7-й ролью в целевой модели?
3. Маржа: в целевой системе унифицируем в один механизм (ролевой ACL) и убираем PIN,
   или сохраняем оба (PIN в калькуляторе + роли в карточке)?
4. Мигрируем поверх текущей ветки `my-new-branch` или заводим отдельную
   `feature/ui-merge`? (рекомендую отдельную)
