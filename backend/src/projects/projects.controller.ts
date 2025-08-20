import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjetsService } from './projects.service';
import { ProjectEntity } from './projects.entity/project.entity';

@Controller('projects')
export class ProjetsController {
    constructor(private readonly projectsService: ProjetsService) { }

    @Get()
    async findAll(): Promise<ProjectEntity[]> {
        return this.projectsService.findAll();
    }

    @Post()
    async create(@Body() projectPayload: ProjectEntity): Promise<ProjectEntity> {
        return this.projectsService.create(projectPayload);
    }

    @Get(':id')
    async readOne(@Param('id') id: number): Promise<ProjectEntity> {
        return this.projectsService.ProjectById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number, @Body() projectData: Partial<ProjectEntity>
    ): Promise<ProjectEntity> {
        return this.projectsService.updateProject(id, projectData);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.projectsService.deleteById(id)
    }
}