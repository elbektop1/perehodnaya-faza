# ENTITY_MODEL.md — Модель данных ART-LINE OS

> ✅ **Проверено по коду** `app.js:269-433`, `reference_data.js` (2026-07-15).
> Это фактические данные текущего прототипа. Целевые сущности (clients, tasks,
> questions, news, calendar) добавляются при миграции — см. `MASTER_PLAN.md` §2, §4.

---

## 1. `orders` — заказы (реальные поля, `app.js:271-279`)

Поля плоские (не вложенные объекты):

`id`(6 симв.), `title`, `customer`(строка), `customerEmail`, `status`, `assignee`(один
id), `acceptedBy`, `hasProblem`, `paid`, `expanded`, `urgent`, `priority`, `materials`[],
`files`[], `knifeId`(один), `cuttingType`("knife"/"laser"), `needNewKnife`, `createdBy`,
`paymentDue`, `clientPrice`, `costPrice`, `runLength`(тираж), `orderType`
("new"/"repeat"/"repeat_changed"), `labelSize`, `material`(строка), `lamination`(строка),
`machine`(строка), `shipDate`, `manager`, `history`[] (`{text, who, when}`).

❌ Нет: вложенного `spec{}`, `gate{}`, отдельных `assigneeDesigner/Printer`,
`machineId`/`knifeIds`-массивов — это один `assignee`+`acceptedBy`, `machine`-строка,
один `knifeId`.

Побочные коллекции: `PROPOSALS = []` (`app.js:433`) — предложения по закупкам.

---

## 2. `employees` (STAFF) — `app.js:2-43`

Поля: `id`, `name`, `role`, `photo`. И всё. Логинов/паролей/загрузки в корне нет
(это `client_reference`/ТЗ). Роли — см. `ROLE_PERMISSION_MATRIX.md`.

---

## 3. Справочники — `reference_data.js` (массивы, «позже станут таблицами PostgreSQL», :4)

| Константа | Тип | Содержимое |
|:--|:--|:--|
| `MATERIALS` | string[] (27) | бумаги, плёнки PP/PE, термо (`:8`) |
| `LAMINATION` | string[] (8) | тиснение, ламинация, «Нет» (`:39`) |
| `INKS` | string[] (10) | CMYK, Pantone, лаки (`:51`) |
| `MACHINES` | string[] (9) | Gallus 200/160, Weigang 450, Bengraphic 330, Labelsmart 325, Montax 370, Arojet 340, **Darui (лазерный)** (`:65`) |
| `ORDER_TYPES` | obj[] (3) | new / repeat / repeat_changed (`:78`) |
| `SMALL_RUN_THRESHOLD` | 3000 | порог «лазер или новый нож» (`:86`) |
| `POPULAR_SIZES` | string[] | быстрый выбор размера (`:90`) |
| `MATERIAL_USE_REASONS` | string[] | Основной/Брак/Техошибка/Доработка (`:97`) |
| `KNIVES` | obj[] (30) | `{id, name, width, height, notes}` — ножи из архива калькулятора (`:101`) |
| `CLIENTS` | string[] (5) | автодополнение поля «Заказчик» (`:135`) |
| `MATERIAL_STOCK` | obj | остатки материалов `{qty, unit, price}` (`:145`) |
| `INK_STOCK` | obj | остатки красок (`:155`) |

`knives`, `machines`, `materials` — сейчас массивы/строки, **не связанные сущности**.

---

## 4. Чего в корне НЕТ (есть в client_reference/ТЗ — цель миграции)

- **`clients`** как сущность — в корне `customer` это строка, `CLIENTS` — массив
  автодополнения. Карточка клиента, воронка, история — цель (CRM, приоритет заказчика).
- **`questions`** («ВОП-XXXX») — в корне проблемы = флаг `hasProblem` + комментарий в
  истории. Отдельная сущность — цель.
- **`tasks`** («ЗАД-XXXX»), **`news`**, **`calendar events`**, **`documents`/`files`**
  с версиями — цель (ТЗ §10.16–10.24).

---

## 5. Целевые сущности (для миграции, поля — по ТЗ)

`clients` (§10.2: ИНН, сегмент, ответственный, след. действие, вкладки), `contacts`
(§10.3), `tasks` (§10.16), `questions` (§10.17), `news` (§10.26), `calendar events`
(§10.24), `history` (сквозной журнал §10.22). Все — за слоем `store.js` в памяти,
готовым стать API (`MASTER_PLAN.md` §2). Денежные поля — целые числа/decimal, не float.
