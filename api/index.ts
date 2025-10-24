import express from "express";
import { registerRoutes } from "../server/routes-vercel.js";
import type { Request, Response } from "express";

// Создаем Express приложение один раз
let app: express.Application | null = null;
let isInitialized = false;

async function getApp() {
  if (app && isInitialized) {
    return app;
  }

  console.log('🚀 Инициализация приложения для Vercel...');
  
  app = express();

  // Устанавливаем переменные окружения для Vercel
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  process.env.VERCEL = 'true';

  // CORS middleware - ДОЛЖЕН быть первым!
  app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin || '*';
    
    // Разрешаем все origins для Telegram Web App
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // Обрабатываем preflight запросы
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Логирование запросов (только в development)
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  try {
    // Регистрируем маршруты
    await registerRoutes(app as any);
    isInitialized = true;
    console.log('✅ Приложение успешно инициализировано для Vercel');
    
    return app;
  } catch (error) {
    console.error('❌ Ошибка инициализации приложения:', error);
    isInitialized = false;
    app = null;
    throw error;
  }
}

// Экспортируем обработчик для Vercel
export default async function handler(req: Request, res: Response) {
  try {
    // Получаем или создаем приложение
    const app = await getApp();
    
    // Устанавливаем таймаут для предотвращения зависания
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        console.error('⏱️ Таймаут запроса:', req.method, req.url);
        res.status(504).json({ 
          error: 'Gateway Timeout',
          message: 'Request took too long to process' 
        });
      }
    }, 55000); // 55 секунд (меньше чем лимит Vercel в 60 сек)
    
    // Используем Express app для обработки запроса
    return new Promise((resolve, reject) => {
      (app as any)(req, res, (error: any) => {
        clearTimeout(timeout);
        
        if (error) {
          console.error('❌ Ошибка в Express app:', error);
          if (!res.headersSent) {
            res.status(500).json({ 
              error: 'Internal Server Error',
              message: process.env.NODE_ENV === 'production' 
                ? 'An error occurred' 
                : error.message 
            });
          }
          reject(error);
        } else {
          resolve(undefined);
        }
      });
    });
    
  } catch (error: any) {
    console.error('❌ Критическая ошибка в обработчике Vercel:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' 
          ? 'An error occurred while processing your request' 
          : error.message 
      });
    }
  }
}