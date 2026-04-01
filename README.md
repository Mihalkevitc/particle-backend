# Particle API

**Веб-сервис интерактивных визуализаций**

API для веб-сервиса интерактивных визуализаций на основе алгоритмов моделирования динамических частиц.

## Возможности

- Регистрация и аутентификация пользователей (JWT)
- Управление пресетами визуализаций (CRUD)
- Публичные пресеты (лента)
- Лайки и комментарии к пресетам
- Статистика просмотров пресетов
- Лайкнутые пресеты (избранное)
- Хранение конфигураций в формате JSON
- Документация API через Swagger

## Стек технологий

- **NestJS** - фреймворк для Node.js
- **TypeScript** - язык программирования
- **PostgreSQL** - база данных (JSONB для гибких конфигураций)
- **TypeORM** - ORM для работы с БД
- **JWT** - аутентификация
- **Swagger** - документация API
- **Docker** - контейнеризация
- **Render** - облачный хостинг

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
npm install
```

### Запуск сервера

```bash
# development
npm run start

# watch mode (рекомендуется для разработки)
npm run start:dev

# production mode
npm run start:prod
```

Сервер запустится на
```bash
http://localhost:3000
```

## API Документация

После запуска сервера документация Swagger доступна по адресу:
```bash
http://localhost:3000/api/docs
```

### Основные эндпоинты


| Метод | URL | Описание |
|:------|:----|:---------|
| POST | `/api/v1/auth/register` | Регистрация |
| POST | `/api/v1/auth/login` | Вход, получение JWT |
| GET | `/api/v1/users/me` | Профиль текущего пользователя |
| GET | `/api/v1/presets/public` | Лента публичных пресетов |
| GET | `/api/v1/presets/liked` | Пресеты, которые лайкнул пользователь |
| GET | `/api/v1/presets` | Мои пресеты |
| POST | `/api/v1/presets` | Создать пресет |
| GET | `/api/v1/presets/:id` | Получить пресет (с просмотрами) |
| GET | `/api/v1/presets/public/:id` | Получить публичный пресет (без авторизации) |
| PUT | `/api/v1/presets/:id` | Обновить пресет |
| DELETE | `/api/v1/presets/:id` | Удалить пресет |
| PATCH | `/api/v1/presets/:id/public` | Сделать публичным/приватным |
| POST | `/api/v1/presets/:id/like` | Поставить лайк |
| DELETE | `/api/v1/presets/:id/like` | Убрать лайк |
| GET | `/api/v1/presets/:id/comments` | Получить комментарии |
| POST | `/api/v1/presets/:id/comments` | Добавить комментарий |
| PUT | `/api/v1/comments/:id` | Обновить комментарий |
| DELETE | `/api/v1/comments/:id` | Удалить комментарий |

### Аутентификация

Для доступа к защищённым эндпоинтам добавьте в заголовок:
```
Authorization: Bearer <ваш_токен>
```

## Тестирование с Postman

В папке `postman/` находится коллекция для Postman:
- `Postman_collection.json`

### Как импортировать
1. Откройте Postman
2. Нажмите `Import` - `File` - выберите файл коллекции
3. Импортируйте

![alt text](postman/image-2.png)

### Настройка окружения в Postman
Создайте Environment с переменными

| Переменная | Значение |
|------------|----------|
| `baseUrl` | `http://localhost:3000` |
| `accessToken` | (заполняется автоматически после логина) |

![alt text](postman/image.png)
---
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
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Структура проекта

```
src/
├── main.ts                   # Точка входа, Swagger, префикс /api/v1
├── app.module.ts             # Главный модуль
├── common/
│   └── decorators/
│       └── get-user.decorator.ts
├── users/                    # Модуль пользователей
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── user.entity.ts
│   └── dto/
├── auth/                     # Модуль аутентификации
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
└── presets/                  # Модуль пресетов
    ├── presets.module.ts
    ├── presets.controller.ts
    ├── presets.service.ts
    ├── preset.entity.ts
    ├── dto/
    ├── likes/                # Вложенный модуль лайков
    ├── comments/             # Вложенный модуль комментариев
    └── views/                # Вложенный модуль просмотров
```

## Связь между пресетами и пользователями

- Каждый пресет привязан к пользователю через поле userId
- Пользователь видит только свои пресеты
- При обновлении/удалении пресета проверяется принадлежность пользователю
- Лайки и комментарии также привязаны к пользователям
- При каждом GET запросе к пресету увеличивается счётчик просмотров

## Развёртывание

При готовности к продакшену:

```bash
# Сборка проекта
npm run build

# Запуск в production режиме
npm run start:prod
```

Для деплоя на облачные платформы (Render, Heroku и т.д.) используется `dist/main.js` как точка входа.

## Ресурсы

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Passport.js Documentation](https://www.passportjs.org)

## Лицензия

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
