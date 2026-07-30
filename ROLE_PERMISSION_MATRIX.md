# ROLE_PERMISSION_MATRIX.md — Роли и права ART-LINE OS

> ✅ **Проверено по коду** `app.js:2-199, 979-980` (ветка `my-new-branch`, 2026-07-15).
> Это фактические роли и меню текущего прототипа. Целевой (расширенный) набор ролей
> для миграции см. `MASTER_PLAN.md` §3.

---

## 1. Роли (9) — `ROLE_LABELS` `app.js:77-87`

`director`(Директор), `assistant`(Помощник директора), `manager`(Менеджер),
`designer`(Дизайнер), `economist`(Экономист/закупщик), `accountant`(Бухгалтер),
`worker`(Печатник), `production_manager`(Менеджер производства), `admin`(Администратор).

`assistant` — «урезанный доступ, без финансов» (`app.js:6`). `economist` — закупщик
(`app.js:23`). `production_manager` — сборщик форм (`app.js:29`).
Роли `technologist` в корне **нет** (она в `client_reference` и ТЗ).

STAFF — 20 реальных сотрудников (`app.js:2-43`).

---

## 2. Меню по ролям — `MENU_BY_ROLE` `app.js:92-159` (факт)

| Роль | Разделы меню |
|:--|:--|
| director | orders, dashboard(Загрузка), staff, archive, materials-report, proposals, finance, earnings, calculator, chat |
| assistant | orders, designers, workers, dashboard, archive, chat |
| manager | orders, new(создать заказ), designers, workers, dashboard, archive, chat |
| designer | orders(Мои задачи), chat |
| worker | orders(Мои задачи), chat |
| economist | orders, finance, archive, materials-report, proposals, chat |
| accountant | orders, finance, archive, materials-report, chat |
| production_manager | production-plan, orders(Все заказы), staff, chat |
| admin | orders, staff, users, archive, materials-report, chat |

Всего ~15 страниц (не 29 — 29 экранов это `client_reference`/ТЗ).
Фильтр заказов — `ROLE_ORDER_FILTER` `app.js:162-172`; подписи — `ROLE_PAGE_SUB`
`app.js:174-184`.

---

## 3. Доступ к деньгам — ролевой гейт (НЕ PIN) — `app.js:979-980`

```js
canEditClientPrice = ["manager","economist","director"]   // цена клиента
canEditCostPrice   = ["economist","director"]              // себестоимость
```

- Себестоимость/маржу правят только **economist, director**.
- Цену клиента — **manager, economist, director**.
- `accountant` цену/себестоимость в карточке заказа **не правит**.
- Страница `earnings` (выручка/себестоимость/прибыль) — в меню только у **director**
  (`app.js:101`).
- **PIN** — отдельный механизм внутри `calculator.html` (16 упоминаний), не в карточке.

По ТЗ §10.6: менеджер себестоимость видеть не должен — совпадает с кодом.

---

## 4. Кто может писать в чат — `renderWriteButton` `app.js:60-66`

`director`/`assistant` — любому; `designer` — только другому дизайнеру. Остальные —
кнопки нет.

---

## 5. Действия по заказам (кто двигает статус)

Из `TRANSITIONS` (см. `FSM_ANALYSIS.md` §3): статусы двигают **manager, designer,
worker, production_manager**. Печатник переводит в `ready` только после «Принять в
работу» (`requiresAccepted`). Остальные роли заказы по статусам не двигают.

---

## 6. Целевой набор ролей (для миграции)

Держим раздельно `economist`, `technologist`, `assistant` (решение заказчика).
Полная целевая матрица роль×раздел строится из расширенного `roleVisibility`
`client_reference` — детали в `MASTER_PLAN.md` §3. Открытые вопросы: объединять ли
`admin` с `director`; мапить ли `production_manager` в `technologist`.
