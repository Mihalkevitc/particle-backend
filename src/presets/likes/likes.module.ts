import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './like.entity';
import { Preset } from '../preset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    TypeOrmModule.forFeature([Preset]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
