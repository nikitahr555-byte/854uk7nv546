# 🚀 Полное руководство по деплою на Vercel

## ✅ Подготовка завершена

Приложение **полностью подготовлено** для деплоя на Vercel. Все необходимые файлы и конфигурации созданы.

## 📋 Что было сделано

### 1. Обновленные файлы конфигурации

- ✅ `vercel.json` - Полная конфигурация для Vercel
- ✅ `.vercelignore` - Исключение ненужных файлов
- ✅ `.env.example` - Пример переменных окружения
- ✅ `api/index.ts` - Serverless функция с таймаутами и улучшенной обработкой ошибок
- ✅ `server/routes-vercel.ts` - Адаптированные маршруты без WebSocket
- ✅ `server/vite-vercel.ts` - Обслуживание статических файлов

### 2. Ключевые изменения

#### Убрано (несовместимо с Vercel):
- ❌ WebSocket сервер (serverless не поддерживает долгие соединения)
- ❌ Telegram bot в long polling режиме
- ❌ NFT image server (отдельные процессы)
- ❌ Файловые сессии (используется PostgreSQL)

#### Оставлено (работает на Vercel):
- ✅ REST API endpoints
- ✅ Авторизация через PostgreSQL sessions
- ✅ Работа с NFT (CRUD операции)
- ✅ Обмен валют
- ✅ Работа с картами
- ✅ React SPA приложение

## 🎯 Пошаговая инструкция деплоя

### Шаг 1: Подготовка базы данных

1. Создайте PostgreSQL базу данных (рекомендуется [Neon.tech](https://neon.tech) или [Supabase](https://supabase.com))
2. Получите `DATABASE_URL` в формате:
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```

### Шаг 2: Создание проекта на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш GitHub/GitLab репозиторий

### Шаг 3: Настройка проекта в Vercel

#### Framework Settings:
- **Framework Preset**: Other (или оставьте пустым)
- **Build Command**: `vite build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

#### Root Directory:
- Оставьте `.` (корневую директорию)

### Шаг 4: Переменные окружения

Добавьте следующие переменные в разделе "Environment Variables":

#### Обязательные:
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=ваш_очень_длинный_случайный_ключ_минимум_32_символа
NODE_ENV=production
```

#### Опциональные:
```bash
TELEGRAM_BOT_TOKEN=ваш_токен_бота
WEBAPP_URL=https://ваш-домен.vercel.app
BLOCKDAEMON_API_KEY=ваш_ключ_api
```

**Генерация SESSION_SECRET:**
```bash
# В терминале:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Шаг 5: Деплой

1. Нажмите "Deploy"
2. Дождитесь завершения сборки (обычно 2-5 минут)
3. Проверьте логи на наличие ошибок

### Шаг 6: Проверка работы

После деплоя проверьте:

1. **Главная страница**: `https://your-app.vercel.app`
2. **API Health**: `https://your-app.vercel.app/api/rates`
3. **Авторизация**: Попробуйте зарегистрироваться/войти

## 🔧 Частые проблемы и решения

### Проблема: "Cannot find module"

**Решение**: Проверьте что все зависимости установлены:
```bash
npm install
```

### Проблема: "Database connection failed"

**Решение**: 
1. Проверьте `DATABASE_URL` в переменных окружения
2. Убедитесь что база данных доступна из интернета
3. Проверьте `?sslmode=require` в конце URL для PostgreSQL

### Проблема: "504 Gateway Timeout"

**Решение**:
1. Оптимизируйте медленные запросы к БД
2. Vercel имеет лимит 60 секунд для serverless функций
3. Используйте индексы в базе данных

### Проблема: CORS ошибки

**Решение**: Уже настроено в `api/index.ts`, но если проблемы:
1. Проверьте что origin разрешен в CORS настройках
2. Для Telegram WebApp добавьте их домены

## 📊 Мониторинг и логи

### Просмотр логов:
1. Перейдите в Vercel Dashboard
2. Выберите ваш проект
3. Вкладка "Deployments" → выберите deployment → "Logs"

### Проверка производительности:
1. Вкладка "Analytics" в Vercel Dashboard
2. Следите за временем ответа API
3. Проверяйте использование памяти

## 🔄 Обновление приложения

При внесении изменений:

1. Сделайте commit и push в GitHub:
   ```bash
   git add .
   git commit -m "Update: ваше описание"
   git push origin main
   ```

2. Vercel автоматически задеплоит изменения

## 🎨 Кастомный домен

1. В Vercel Dashboard → Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи как указано Vercel
4. Обновите `WEBAPP_URL` в переменных окружения

## ⚡ Оптимизация

### Для ускорения:
1. **Используйте Edge Functions** (если возможно)
2. **Включите кэширование** для статических ресурсов
3. **Оптимизируйте изображения NFT**:
   - Используйте AVIF/WebP формат
   - Сжимайте изображения
   - Рассмотрите CDN для больших файлов

### Для экономии:
1. **Минимизируйте вызовы БД** - используйте кэширование
2. **Оптимизируйте bundle size** - удалите неиспользуемые зависимости
3. **Используйте stateless подход** где возможно

## 📝 Checklist перед деплоем

- [ ] База данных создана и доступна
- [ ] Все переменные окружения добавлены в Vercel
- [ ] SESSION_SECRET сгенерирован (минимум 32 символа)
- [ ] DATABASE_URL корректный и протестирован
- [ ] Код закоммичен в GitHub
- [ ] .env.example обновлен (но .env НЕ в репозитории!)
- [ ] Проверены логи сборки в Vercel
- [ ] Протестирована авторизация
- [ ] Проверены основные API endpoints

## 🆘 Поддержка

### Если что-то не работает:

1. **Проверьте логи** в Vercel Dashboard
2. **Проверьте переменные окружения**
3. **Проверьте подключение к БД**
4. **Проверьте что все файлы закоммичены**

### Полезные ссылки:
- [Vercel Documentation](https://vercel.com/docs)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

## ✅ Готово!

Приложение полностью готово к деплою. Следуйте инструкциям выше и ваше приложение будет работать на Vercel.

---

**Последнее обновление**: Октябрь 2025
**Версия конфигурации**: 2.0
