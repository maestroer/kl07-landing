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

Vite 5 · React 18 · TypeScript · Tailwind 3 · react-router-dom 6. Внешних UI-библиотек нет, графики — свой SVG.

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

Строка «внешних денег» в панели статуса на главной открывает окно донатов, оформленное как основное окно
проекта. Адреса задаются в массиве `wallets` в [`src/site.ts`](src/site.ts) — пустой `address` показывается
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
