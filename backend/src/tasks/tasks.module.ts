import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './tasks.entity/tasks.entity';
import { BlocsModule } from '../blocs/blocs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    BlocsModule,
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule { }
