import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './projects.entity/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjetsService {
    constructor(
        @InjectRepository(ProjectEntity)
        private projectsRepository: Repository<ProjectEntity>,
    ) { }

    async findAll(): Promise<ProjectEntity[]> {
        const allProjects = this.projectsRepository.find();

        if (!allProjects) {
            throw new Error("Project not found !");
        }

        return allProjects;
    }

    async create(projectPayload: Partial<ProjectEntity>): Promise<ProjectEntity> {
        const newProject = this.projectsRepository.create(projectPayload);
        return this.projectsRepository.save(newProject);
    }

    async ProjectById(id: number): Promise<ProjectEntity> {
        const project = await this.projectsRepository.findOne({ where: { id } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
        return project;
    }

    async deleteById(id: number): Promise<void> {
        const deleteProject = await this.projectsRepository.delete(id);
        if (deleteProject.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
    }

    async updateProject(id: number, projectData: Partial<ProjectEntity>) {
        const projectToUpdate = await this.projectsRepository.findOneBy({ id });

        if (!projectToUpdate) {
            throw new NotFoundException("Project not found !");
        }

        Object.assign(projectToUpdate, projectData);

        const updateProject = await this.projectsRepository.save(projectToUpdate);

        return updateProject;

    }
}
