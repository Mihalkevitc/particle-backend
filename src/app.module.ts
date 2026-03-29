import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PresetsModule } from './presets/presets.module';

@Module({
  imports: [
    // Загружаем переменные окружения из .env файла
    ConfigModule.forRoot({
      isGlobal: true,      // Делает ConfigService доступным везде без импорта
      envFilePath: '.env', // Путь к файлу с переменными
    }),
    
    // Настраиваем подключение к PostgreSQL через TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') ?? '5432'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,  // Автоматически создаёт таблицы (только для разработки)
        logging: true,      // Выводит SQL-запросы в консоль
      }),
    }),
    
    PresetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}