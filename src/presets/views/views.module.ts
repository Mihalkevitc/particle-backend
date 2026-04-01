import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewsService } from './views.service';
import { View } from './view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([View])],
  providers: [ViewsService],
  exports: [ViewsService],
})
export class ViewsModule {}
