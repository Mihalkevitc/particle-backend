# Particle API

**Веб-сервис интерактивных визуализаций**

API для веб-сервиса интерактивных визуализаций на основе алгоритмов моделирования динамических частиц. Проект включает в себя:
- Регистрацию и аутентификацию пользователей (JWT)
- Управление пресетами визуализаций (CRUD)
- Хранение конфигураций в формате JSON
- Документацию API через Swagger

## Стек технологий

- **NestJS** — фреймворк для Node.js
- **TypeScript** — язык программирования
- **PostgreSQL** — база данных (JSONB для гибких конфигураций)
- **TypeORM** — ORM для работы с БД
- **JWT** — аутентификация
- **Swagger** — документация API
- **Docker** — контейнеризация
- **Render** — облачный хостинг

## Установка и запуск

### Требования
- Node.js (v18+)
- PostgreSQL (локально или удалённо)

### Настройка окружения

### Установка

1. Клонируйте репозиторий и перейдите в папку проекта
```bash
git clone https://github.com/Mihalkevitc/particle-backend.git
cd particle-backend
```

2. Создайте базу данных

```bash
CREATE DATABASE particle_db;
```

3. В кроне проекта создайте файл `.env` и заполните параметры:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=particle_db
JWT_SECRET=your-super-secret-key-change-this
```

### Установка зависимостей

```bash
$ npm install
```

### Запуск сервера

```bash
# development
$ npm run start

# watch mode (рекомендуется для разработки)
$ npm run start:dev

# production mode
$ npm run start:prod
```

Сервер запустится на `
```bash
http://localhost:3000`
```

## API Документация

После запуска сервера документация Swagger доступна по адресу:
```
http://localhost:3000/api/docs
```

### Основные эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/v1/auth/register` | Регистрация пользователя |
| POST | `/api/v1/auth/login` | Вход, получение JWT токена |
| GET | `/api/v1/users/me` | Получить профиль текущего пользователя |
| GET | `/api/v1/presets` | Получить все пресеты пользователя |
| POST | `/api/v1/presets` | Создать новый пресет |
| GET | `/api/v1/presets/:id` | Получить пресет по ID |
| PUT | `/api/v1/presets/:id` | Обновить пресет |
| DELETE | `/api/v1/presets/:id` | Удалить пресет |

### Аутентификация

Для доступа к защищённым эндпоинтам добавьте в заголовок:
```
Authorization: Bearer <ваш_токен>
```

## Тестирование с Postman

В папке `postman/` находится коллекция для Postman:
- `Postman_collection.json` — коллекция запросов

**Как импортировать:**
1. Откройте Postman
2. Нажмите `Import` - `File` - выберите файл коллекции
3. Импортируйте

![alt text](postman/image-2.png)

**Настройка окружения в Postman:**
Создайте Environment с переменными:

![alt text](postman/image.png)

| Переменная | Значение |
|------------|----------|
| `baseUrl` | `http://localhost:3000` |
| `accessToken` | (заполняется автоматически после логина) |

![alt text](postman/image-1.png)

**Порядок тестирования:**
1. `Auth - Register` - создать пользователя
2. `Auth - Login` - войти (токен сохранится автоматически)
3. `Users - Get Current User` - получить профиль
4. `Presets - Create Preset` - создать пресет
5. `Presets - Get All Presets` - получить список

## Тесты

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Структура проекта

```
src/
├── main.ts                   # Точка входа, Swagger, глобальный префикс /api/v1
├── app.module.ts             # Главный модуль
├── common/
│   └── decorators/
│       └── get-user.decorator.ts   # Декоратор для получения пользователя
├── users/                    # Модуль пользователей
│   ├── users.module.ts
│   ├── users.controller.ts   # GET /users/me
│   ├── users.service.ts      # Поиск, создание, хеширование паролей
│   ├── user.entity.ts
│   └── dto/
├── auth/                     # Модуль аутентификации
│   ├── auth.module.ts
│   ├── auth.controller.ts    # POST /auth/register, POST /auth/login
│   ├── auth.service.ts       # Регистрация, логин, JWT
│   ├── guards/
│   └── strategies/
└── presets/                  # Модуль пресетов
    ├── presets.module.ts
    ├── presets.controller.ts # CRUD для /presets
    ├── presets.service.ts    # Бизнес-логика, проверка владельца
    ├── preset.entity.ts
    └── dto/
```

## Связь между пресетами и пользователями

- Каждый пресет привязан к пользователю через поле `userId`
- Пользователь видит только свои пресеты (`findAllByUser`)
- При обновлении/удалении пресета проверяется принадлежность пользователю (`findOneAndCheckOwner`)

## Развёртывание

При готовности к продакшену:

```bash
# Сборка проекта
$ npm run build

# Запуск в production режиме
$ npm run start:prod
```

Для деплоя на облачные платформы (Render, Heroku и т.д.) используется `dist/main.js` как точка входа.

## Ресурсы

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Passport.js Documentation](https://www.passportjs.org)

## Лицензия

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
