# FSM_ANALYSIS.md — Конечный автомат заказа ART-LINE OS

> ✅ **Проверено по коду** `app.js:202-266` (ветка `my-new-branch`, 2026-07-15).
> Это фактическая FSM текущего прототипа. Целевую (расширенную) цепочку заказа см. в
> ТЗ заказчика §8 и в `MASTER_PLAN.md` §7.

---

## 1. Статусы (7) — `app.js:202-210`

| key | Название | Смысл |
|:--|:--|:--|
| `new` | Новый | Заказ создан менеджером |
| `design` | У дизайнера | Дизайнер делает макет |
| `rework` | На доработке | Вернули с замечаниями |
| `approval` | На согласовании | Макет готов, ждёт менеджера |
| `production` | В производстве | Печатник печатает |
| `ready` | Готов к отгрузке | Печатник отметил готовность |
| `done` | Готово | Завершён (терминальный) |

`getStatus(key)` — `app.js:211`.

---

## 2. Переходы — `app.js:214-247` (полная таблица TRANSITIONS)

| Из | Куда | Роль | Флаги |
|:--|:--|:--|:--|
| new | design | manager | assignTo: designer, primary |
| new | production | manager | assignTo: worker (сразу в производство) |
| design | design | designer | accept (self-loop «Принять в работу») |
| design | approval | designer | primary |
| design | new | designer | comment, problem («Вернуть с проблемой») |
| rework | rework | designer | accept |
| rework | approval | designer | primary |
| approval | production | manager | assignTo: worker, primary |
| approval | rework | manager | comment («На доработку») |
| approval | production | production_manager | assignTo: worker, primary («Передать в производство») |
| production | production | worker | accept |
| production | production | production_manager | accept (подготовка форм) |
| production | ready | worker | **requiresAccepted**, variant ok |
| production | approval | worker | comment, problem, historyText «Возвращён с проблемой» |
| ready | done | manager | variant ok |
| done | — | — | нет переходов |

Схема:
```
new ─▶ design ⇄(accept) ─▶ approval ─▶ production ⇄(accept) ─▶ ready ─▶ done
  │        └─▶ new (проблема)      │  ▲                     │
  └─▶ production (сразу)           │  └── rework ◀───────────┘ (на доработку)
                                   └──▶ approval (проблема из производства)
rework ⇄(accept) ─▶ approval
```

Повтор без изменений (`orderType:"repeat"`) идёт сразу на approval, минуя дизайнера
(CLAUDE.md; ветка создания заказа).

---

## 3. Кто меняет статус — только 4 роли

В `TRANSITIONS` фигурируют: **manager, designer, worker, production_manager**.
`economist, accountant, director, assistant, admin` заказы по статусам **не двигают**.

Фильтр видимости очереди — `ROLE_ORDER_FILTER` (`app.js:162-172`):
`designer → [design, rework]`, `worker → [production]`, остальные — все статусы.

---

## 4. Guards (предусловия) — реально два

| Guard | Где | Код |
|:--|:--|:--|
| `requiresAccepted` | production → ready доступен только если `order.acceptedBy != null` | `app.js:238`, фильтр `app.js:595-597` |
| `comment` | обязательный комментарий при проблемных возвратах | `app.js:223,231,241` |

Механика принятия: `accept:true` — self-loop без смены статуса, проставляет
`order.acceptedBy` (поле, `app.js:273`). Это **не отдельный статус**, а флаг.

Побочные эффекты: запись в `order.history` (`HISTORY_TEXT` `app.js:249-256`),
флаг `hasProblem` по `action.problem`. `STATUS_TIPS` — `app.js:258-266`.

❌ В текущей FSM НЕТ: gate из 5 чек-боксов, financeClearance, materialsAvailable,
статусов lead/draft/calculation/shipment/cancelled. Это цель (ТЗ), не факт.

---

## 5. Целевые блокировки (ТЗ §13) — добавляются позже

Нельзя в печать без подписанного бланка; нельзя отгрузить без оплаты/отсрочки; нельзя
менять подписанный документ без версии; нельзя терять историю. Реализуются при
интеграции финансов/документов (после оплаты). Делать guard'ы чистыми функциями —
переедут на бэкенд без переписывания.
