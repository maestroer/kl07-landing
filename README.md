# KL07 — лендинг

Две страницы в одном SPA:

- `/` — продукт: проблема, сравнение с конкурентами, 7 модулей, AI-архитектор, тарифы, статус, вейтлист.
- `/invest` — материал для инвестора: профайл, рынок, юнит-экономика в графиках, статус, сильные стороны и риски, условия A/B/C, контакт.

Языки: RU (по умолчанию) и EN, переключатель в титульной строке терминала, выбор запоминается в `localStorage`.

## Запуск

```bash
npm install
npm run dev
```

Прод-сборка: `npm run build` → `dist/`. Превью сборки: `npm run preview`.

## Стек

Vite 5 · React 19 · TypeScript · react-router-dom 6.

Интерфейс собран из двух shadcn-реестров, код компонентов лежит прямо в репозитории и правится как свой:

- **[Arc UI](https://uiarc.dev)** — весь каркас: кнопки, бейджи, диалог, слайдеры, графики, переключатель
  тарифов, прогресс, поля формы. Лежит в `src/components/arc/`, стили — CSS-модули на токенах из
  `src/components/arc/foundation.css`.
- **[Componentry](https://componentry.dev)** — три акцента в `src/components/ui/`: `LetterCascade` (логотип и
  заголовки), `MagnetLines` (шапка главной), `CircuitBoard` (схемы «один флоу» и «один движок»).

Tailwind 3 отвечает только за раскладку; его цвета, радиусы и шрифты в `tailwind.config.js` привязаны к
токенам Arc, поэтому тема меняется в одном месте.

### Тема и акцент

Светлая и тёмная тема переключаются атрибутом `data-theme` на `<html>` (кнопка в шапке, выбор хранится в
`localStorage`, до первой отрисовки тему ставит инлайн-скрипт в `index.html`). Фирменный цвет — атрибут
`data-accent="violet"` там же; у Arc восемь готовых акцентов.

### Добавить компонент из реестра

```bash
python scripts/install-registry.py arc/tooltip cy/letter-cascade
```

Скрипт читает registry-JSON, тянет зависимости реестра и раскладывает файлы по `src/`. Список npm-пакетов,
которые нужно доустановить, печатает в конце. Реестры также прописаны в `components.json` для `shadcn` CLI.

## Куда уходит вейтлист

Форма на главной шлёт JSON `{ email, segment, source, at }` методом POST на `VITE_WAITLIST_ENDPOINT`.

```bash
# .env.local
VITE_WAITLIST_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Подойдёт Formspree, Google Apps Script, Telegram-бот через прокси или собственный роут KL07-бэкенда.
Если переменная не задана, форма падает в `mailto:`-фолбэк — лид всё равно доходит, но конверсия не измеряется.

## Контакты и документы

Telegram и почта задаются в [`src/site.ts`](src/site.ts). PDF лежат в `public/` и линкуются со страницы
инвестора — при обновлении презентации замените файлы там же.

## Кошельки для донатов

Кнопка «поддержать криптой» под прогрессом сбора на главной открывает диалог с кошельками. Сумма сбора
задаётся в `fundraising` там же, где кошельки. Адреса задаются в массиве `wallets` в [`src/site.ts`](src/site.ts) — пустой `address` показывается
как «скоро», заполненный превращается в кликабельную строку с копированием в буфер.

## Контент

Весь текст вынесен в словари [`src/content/ru.ts`](src/content/ru.ts) и [`src/content/en.ts`](src/content/en.ts).
`ru.ts` — источник типа `Dict`, `en.ts` обязан ему соответствовать, поэтому забыть перевод не выйдет: `tsc` не соберёт.

## Деплой

Хостится на GitHub Pages. `.github/workflows/deploy.yml` собирает проект и публикует `dist/` при каждом
push в `main`; руками ничего запускать не нужно.

Pages не умеет SPA-fallback, поэтому workflow копирует `dist/index.html` в `dist/404.html` — без этого
прямой заход на `/invest` вернул бы страницу ошибки GitHub.

Домен привязан через файл `public/CNAME` (попадает в сборку как есть) плюс DNS-записи на Cloudflare.
`VITE_WAITLIST_ENDPOINT` задаётся как repository variable в Settings → Secrets and variables → Actions → Variables.
