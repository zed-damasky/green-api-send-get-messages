# GREEN-API MAX

Веб-приложение для обмена текстовыми сообщениями через мессенджер **MAX** с использованием сервиса [GREEN-API](https://green-api.com/). Реализовано как прототип.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite)

## Демо

Для обеспечения стабильного доступа из разных регионов и сетей предоставлено несколько зеркал приложения. Если один из сервисов недоступен или работает медленно, пожалуйста, используйте альтернативную ссылку:

| Платформа | Ссылка |
| :--- | :--- |
| **Onreza** (RU) | [green-api-send-get-messages-zed-damasky-7j4g.onreza.app](https://green-api-send-get-messages-zed-damasky-7j4g.onreza.app/) | 
| **Vercel** (Global CDN) | [green-api-send-get-messages.vercel.app](https://green-api-send-get-messages.vercel.app/) | 
| **TatNet** (RU) | [green-api-send-get-messages.tatnet.app](https://green-api-send-get-messages.tatnet.app/) |

## Содержание

- [Особенности](#особенности)
- [Технологии](#технологии)
- [Установка и запуск](#установка-и-запуск)
- [Использование](#использование)

## Особенности

- **Авторизация по ключам API** — ввод `idInstance` и `apiTokenInstance` без хранения токенов на сервере
- **Множественные чаты** — можно вести переписку с несколькими контактами одновременно
- **Счётчик непрочитанных** — бейджи с количеством непрочитанных сообщений в боковой панели
- **Оптимистичный UI** — сообщения мгновенно появляются в интерфейсе с автоматическим откатом при ошибке
- **Защита от дубликатов** — уникальные сообщения гарантируются через `Set<receiptId>` и фильтрацию
- **Адаптивный дизайн** — интерфейс в стиле web.max.ru с паттерном на фоне
- **Горячие клавиши** — отправка по `Enter`, перенос строки по `Shift+Enter`

Проект реализует следующие требования:
- Отправка и получение только текстовых сообщений
- Использование метода [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/)
- Получение сообщений через [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/) (polling)
- Интерфейс в стиле [web.max.ru](https://web.max.ru/)
- Простой минималистичный UX с минимальным набором функций

## Технологии

| Категория | Технология |
|-----------|------------|
| Фреймворк | React 19 |
| Язык | TypeScript 6.0 |
| Сборщик | Vite 8.3 |
| Стили | Tailwind CSS 4.3 |
| UI-библиотека | shadcn/ui + Radix UI |
| Иконки | lucide-react |
| Уведомления | react-hot-toast |
| API | GREEN-API v3 (HTTP API) |

## Установка и запуск

### Предварительные требования
- Node.js 20+
- npm или yarn
- Аккаунт в [GREEN-API](https://green-api.com/) с настроенным инстансом MAX:
  - apiUrl
  - idInstance
  - apiTokenInstance

### Шаги установки

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/zed-damasky/green-api-send-get-messages.git
   cd green-api-send-get-messages
   ```
2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения**

   Создайте файл .env в корне проекта:

    ```env
   VITE_GREEN_API_BASE_URL=yourApiUrl
    ```

4. **Запустите dev-сервер**
    ```bash
   npm run dev
    ```
   и перейдите по адресу http://localhost:5173


## Использование

1. Войдите в систему: введите idInstance и apiTokenInstance из личного кабинета GREEN-API
2. Создайте новый чат: нажмите "Начать новый чат" и введите номер телефона получателя в международном формате (например, 79991234567)
3. Отправьте сообщение: напишите текст и нажмите Enter или кнопку отправки
4. Получайте ответы: входящие сообщения автоматически появятся в чате через polling
