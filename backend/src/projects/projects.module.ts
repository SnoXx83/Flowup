import { Module } from '@nestjs/common';
import { ProjectEntity } from './projects.entity/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetsService } from './projects.service';
import { ProjetsController } from './projects.controller';
import { TaskEntity } from 'src/tasks/tasks.entity/tasks.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectEntity, TaskEntity]),
    ],
    providers: [ProjetsService],
    controllers: [ProjetsController],
})
export class ProjectsModule { }
