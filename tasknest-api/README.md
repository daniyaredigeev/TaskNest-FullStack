# Authentication API (NestJS)

## Описание проекта

Данный проект реализует систему **аутентификации пользователей** на базе **NestJS** с использованием **JWT (JSON Web Token)**.

Приложение позволяет:

- регистрировать пользователя
- выполнять вход (login)
- получать JWT access token
- обновлять токен через refresh token
- выходить из системы
- получать данные текущего пользователя через защищённый маршрут

Аутентификация реализована с использованием:

- **JWT (Access Token)**
- **Refresh Token**
- **HttpOnly cookies**
- **Passport + JwtStrategy**
- **Prisma ORM**
- **argon2 для хеширования паролей**

---

# Используемые технологии

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL 
- Passport
- passport-jwt
- JSON Web Token
- argon2

---

# Установка проекта

Установите зависимости:

```bash
npm install
```

---

# Переменные окружения

Создайте файл `.env` в корне проекта.

Пример `.env.example`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/db"

JWT_SECRET=supersecret
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=7d

COOKIE_DOMAIN=localhost
```

---

# Запуск проекта

### Режим разработки

```bash
npm run start:dev
```

### Production режим

```bash
npm run start:prod
```

---

# Логика работы аутентификации

1. Пользователь регистрируется.
2. Пароль хешируется с помощью **argon2**.
3. Пользователь выполняет вход через **email и password**.
4. Сервер проверяет пароль.
5. При успешной авторизации генерируется **JWT access token**.
6. Refresh token сохраняется в **HttpOnly cookie**.
7. Защищённые маршруты требуют **валидный JWT токен**.

---

# API маршруты

## Регистрация

POST `/auth/register`

Пример запроса:

```json
{
  "email": "user@example.com",
  "name": "John",
  "password": "StrongPassword123"
}
```

Ответ:

```json
{
  "accessToken": "jwt_token"
}
```

---

## Вход (Login)

POST `/auth/login`

Пример запроса:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

Ответ:

```json
{
  "accessToken": "jwt_token"
}
```

---

## Обновление токена

POST `/auth/refresh`

Используется refresh token из cookies для получения нового access token.

Ответ:

```json
{
  "accessToken": "jwt_token"
}
```

---

## Выход

POST `/auth/logout`

Удаляет refresh token из cookies.

Ответ:

```json
{
  "message": "Вы успешно вышли из аккаунта"
}
```

---

## Защищённый маршрут

GET `/auth/me`

Требуется заголовок:

```
Authorization: Bearer <accessToken>
```

Ответ:

```json
{
  "id": "user_id"
}
```

---


# Тестирование

Проверить API можно через:

- Postman
- Insomnia
- curl

Основные сценарии проверки:

- успешный login
- login с неверным паролем
- доступ к защищённому маршруту с токеном
- доступ к защищённому маршруту без токена

---

# Основные возможности

- безопасное хранение паролей (argon2)
- JWT аутентификация
- refresh token через HttpOnly cookie
- защищённые маршруты через JwtGuard
- валидация токена через JwtStrategy

---

# Автор

Учебный проект по реализации аутентификации в **NestJS**.
