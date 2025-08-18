import { Module } from '@nestjs/common';
import { ProjectEntity } from './projets.entity/project.entity';
import { PageEntity } from 'src/pages/pages.entity/page.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectEntity, PageEntity]),
    ],
})
export class ProjetsModule { }
