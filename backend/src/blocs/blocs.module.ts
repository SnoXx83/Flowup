import { Module } from '@nestjs/common';
import { BlocsService } from './blocs.service';
import { BlocsController } from './blocs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlocEntity } from './blocs.entity/blocs.entity';
import { TaskEntity } from 'src/tasks/tasks.entity/tasks.entity';
import { ProjectEntity } from 'src/projects/projects.entity/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlocEntity, TaskEntity, ProjectEntity]),
    BlocsModule,
  ],
  providers: [BlocsService],
  controllers: [BlocsController],
  exports: [
    TypeOrmModule,
    BlocsService,
  ],
})
export class BlocsModule {}