import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresetsController } from './presets.controller';
import { PresetsService } from './presets.service';
import { Preset } from './preset.entity';

@Module({
  // Регистрируем сущность Preset в TypeORM, чтобы можно было использовать Repository
  imports: [TypeOrmModule.forFeature([Preset])],
  controllers: [PresetsController],
  providers: [PresetsService],
  // Если понадобится использовать PresetsService в других модулях — добавить в exports
  exports: [PresetsService],
})
export class PresetsModule {}