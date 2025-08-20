import { Module } from '@nestjs/common';
import { ProjectEntity } from './projects.entity/project.entity';
import { PageEntity } from 'src/pages/pages.entity/page.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetsService } from './projects.service';
import { ProjetsController } from './projects.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectEntity, PageEntity]),
    ],
    providers: [ProjetsService],
    controllers: [ProjetsController],
})
export class ProjectsModule { }
