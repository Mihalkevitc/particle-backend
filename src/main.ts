import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Swagger
import { ValidationPipe } from '@nestjs/common'; // Валидация для DTO
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // НЕ ДОБАВЛЯТЬ ПОКА В РАЗРАБОТКЕ!!!
  // // Настройка валидации для DTO
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,           // Удаляет поля, которых нет в DTO
  //   forbidNonWhitelisted: true, // Бросает ошибку, если есть лишние поля
  //   transform: true,           // Автоматически преобразует типы
  // }));
  
  // Глобальный префикс для всех API маршрутов
  app.setGlobalPrefix('api/v1');

  // Настройка Swagger документации
  const config = new DocumentBuilder()
    .setTitle('Particle API')
    .setDescription(`
      API для веб-сервиса интерактивных визуализаций.
      
      ## Возможности:
      - Регистрация и аутентификация пользователей (JWT)
      - Управление пресетами (CRUD)
      - Пресеты хранят конфигурации визуализаций в формате JSON
      
      ## Аутентификация:
      Для доступа к защищённым эндпоинтам добавьте в заголовок:
      \`Authorization: Bearer <ваш_токен>\`
    `)
    .setVersion('1.0')
    .addBearerAuth() // Поддержка JWT в Swagger UI
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  // Документация доступна по адресу: /api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Сервер запущен на http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger документация: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();