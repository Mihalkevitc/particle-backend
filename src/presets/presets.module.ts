import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresetsController } from './presets.controller';
import { PresetsService } from './presets.service';
import { Preset } from './preset.entity';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { ViewsModule } from './views/views.module';
import { UsersModule } from '../users/users.module';

@Module({
  // Регистрация сущности Preset в TypeORM, чтобы можно было использовать Repository
  imports: [TypeOrmModule.forFeature([Preset]),
    LikesModule,
    CommentsModule,
    ViewsModule,
    UsersModule,
  ],
  controllers: [PresetsController],
  providers: [PresetsService],
  exports: [PresetsService],
})
export class PresetsModule {}