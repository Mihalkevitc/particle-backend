import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController, CommentByIdController } from './comments.controller';
import { Comment } from './comment.entity';
import { UsersModule } from '../../users/users.module';
import { Preset } from '../preset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]),
  TypeOrmModule.forFeature([Preset]),
  UsersModule,
  ],
  controllers: [CommentsController, CommentByIdController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
