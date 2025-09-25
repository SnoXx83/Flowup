import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './tasks.entity/tasks.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from 'src/projects/projects.entity/project.entity';
import { BlocEntity } from 'src/blocs/bloc.entity/bloc.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserEntity } from 'src/users/users.entity/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskEntity)
        private tasksRepository: Repository<TaskEntity>,
        @InjectRepository(ProjectEntity)
        private projectsRepository: Repository<ProjectEntity>,
        @InjectRepository(BlocEntity)
        private blocsRepository: Repository<BlocEntity>,
    ) { }

    async findAll(): Promise<TaskEntity[]> {
        const allPages = this.tasksRepository.find();

        if (!allPages) {
            throw new Error("Page not found !");
        }

        return allPages;
    }

    async create(
        createTaskDto: CreateTaskDto,
        user: UserEntity,
        projectId: number): Promise<TaskEntity> {
        const project= await this.projectsRepository.findOneBy({id: projectId});
        
        if(!project){
            throw new NotFoundException('Project not found');
        }

        const newTask = this.tasksRepository.create({
            ...createTaskDto,
            user: user,
            project: project,
        });

        const savedTask= await this.tasksRepository.save(newTask);

        const newBlocs= createTaskDto.blocs.map(blocDto=>{
            return this.blocsRepository.create({
                ...blocDto,
                task: savedTask,
            });
        });

        await this.blocsRepository.save(newBlocs);
    
        return savedTask;
    }


    async PageById(id: number): Promise<TaskEntity> {
        const page = await this.tasksRepository.findOne({ where: { id } });

        if (!page) {
            throw new NotFoundException(`Page with ID "${id}" not found.`);
        }

        return page;
    }


    async findTasksByProjectId(projectId: number): Promise<TaskEntity[]> {
    return this.tasksRepository.find({ 
      where: { project: { id: projectId } },
      relations: ['project']
    });
  }

    async updateTaskStatus(taskId: number, newStatus: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOneBy({ id: taskId });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    task.status = newStatus;
    
    return this.tasksRepository.save(task);
  }

    async updateTask(id: number, pageData: Partial<TaskEntity>) {
        const pageToUpdate = await this.tasksRepository.findOneBy({ id });

        if (!pageToUpdate) {
            throw new NotFoundException("Page not found !");
        }

        Object.assign(pageToUpdate, pageData);

        const updatePage = await this.tasksRepository.save(pageToUpdate);

        return updatePage;
    }

    async deleteById(id: number): Promise<void> {
        const deletePage = await this.tasksRepository.delete(id);
        if (deletePage.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
    }
}
