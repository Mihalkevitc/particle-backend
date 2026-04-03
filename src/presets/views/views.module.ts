import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewsService } from './views.service';
import { View } from './view.entity';
import { Preset } from '../preset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([View]),
  TypeOrmModule.forFeature([Preset]),
],
  providers: [ViewsService],
  exports: [ViewsService],
})
export class ViewsModule {}
