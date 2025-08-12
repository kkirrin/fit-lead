## FitLead: система управления партнерскими товарами

FitLead — fullstack-приложение для фитнес-блогеров: управление партнерскими товарами, генерация реферальных ссылок и базовая статистика по кликам и потенциальному доходу.

![Скриншот](./screenshot.png)

### Основной функционал
- Дашборд: ключевые метрики (товары, клики, потенциальный доход) и последние товары
- Управление товарами: CRUD, поиск, фильтры и сортировки
- Реферальные ссылки: редирект на оригинальный товар и учет кликов
- Статистика: топ-5 товаров по кликам, товары по категориям
- Настройки профиля: имя, email, аватар

### Технологии
- Frontend: Next.js, React, TypeScript, Tailwind CSS, Axios, Chart.js
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Nanoid

### Требования
- Node.js 18+
- Docker (для локальной MongoDB)

### Быстрый старт (одной командой)
1) Запустите MongoDB:

```bash
docker run -d -p 27017:27017 --name db-fit-lead mongo
```

2) Установите зависимости фронта и бэка:

```bash
cd back && npm install && cd ../front && npm install && cd ..
```

3) Импортируйте тестовые данные:

```bash
cd back && npm run data:import && cd ..
```

4) Запустите приложение (поднимет API и фронт одновременно):

```bash
npm run start
```

После этого:
- API: `http://localhost:5000`
- Front: `http://localhost:3000`

### Ручной запуск по частям (если нужно)
- Backend: `cd back && npm run dev`
- Frontend: `cd front && npm run dev`

### Переменные окружения
- `back`: `.env` (в корне репозитория) с `MONGO_URI` и опционально `FRONTEND_ORIGINS`
- `front`: `.env.local` с `NEXT_PUBLIC_API_URL` (по умолчанию `http://localhost:5000/api`)

### Остановка
```bash
docker stop db-fit-lead && docker rm db-fit-lead
```
