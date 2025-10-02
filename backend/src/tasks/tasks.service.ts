import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './tasks.entity/tasks.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from 'src/projects/projects.entity/project.entity';
import { BlocEntity } from 'src/blocs/blocs.entity/blocs.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserEntity } from 'src/users/users.entity/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

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

    // GET ALL Tasks
    async findAll(): Promise<TaskEntity[]> {
        const allPages = this.tasksRepository.find();

        if (!allPages) {
            throw new Error("Page not found !");
        }

        return allPages;
    }

    // GET Task by Id with blocs relations 
    async TaskById(id: number): Promise<TaskEntity> {
        return this.tasksRepository.findOneOrFail({
            where: { id },
            relations: ['blocs'],
        });
    }

    // POST Task with blocs 
    async create(
        createTaskDto: CreateTaskDto,
        user: UserEntity,
        projectId: number): Promise<TaskEntity> {

        const project = await this.projectsRepository.findOneBy({ id: projectId });
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        const newTask = this.tasksRepository.create({
            ...createTaskDto,
            user: user,
            project: project,
        });

        const savedTask = await this.tasksRepository.save(newTask);

        const newBlocs = createTaskDto.blocs.map(blocDto => {
            return this.blocsRepository.create({
                ...blocDto,
                task: savedTask,
            });
        });

        await this.blocsRepository.save(newBlocs);

        const taskWithBlocs = await this.tasksRepository.findOne({
            where: { id: savedTask.id },
            relations: ['blocs'],
        });

        if (taskWithBlocs) {
            return taskWithBlocs;
        }
        return savedTask;
    }


    // GET ALL TASKS by the ProjectId
    async findTasksByProjectId(projectId: number): Promise<TaskEntity[]> {
        return this.tasksRepository.find({
            where: { project: { id: projectId } },
            relations: ['project']
        });
    }


    async updateTask(id: number, taskData: UpdateTaskDto): Promise<TaskEntity> {
        const { blocs, ...taskSimpleData } = taskData;

        if (Object.keys(taskSimpleData).length > 0) {
            await this.tasksRepository.update(id, taskSimpleData);
        }

        if (blocs) {
            const taskToUpdate = await this.TaskById(id);
            const existingBlocs = taskToUpdate.blocs;
            const taskRelation = { id: id };
            const blocPromises: Promise<BlocEntity>[] = [];
            const blocsToKeepIds = new Set(blocs.filter(b => b.id).map(b => b.id));

            for (const blocData of blocs) {
                if (blocData.id) {
                    const existingBloc = existingBlocs.find(b => b.id === blocData.id);
                    if (existingBloc) {
                        blocPromises.push(
                            this.blocsRepository.save({
                                ...existingBloc,
                                ...blocData,
                                task: taskRelation,
                            })
                        );
                    }
                } else {
                    blocPromises.push(
                        this.blocsRepository.save(this.blocsRepository.create({
                            ...blocData,
                            task: taskRelation,
                        }))
                    );
                }
            }

            await Promise.all(blocPromises);

            const blocsToDelete = existingBlocs.filter(b => !blocsToKeepIds.has(b.id));

            if (blocsToDelete.length > 0) {
                await this.blocsRepository.remove(blocsToDelete);
            }
        }

        return this.TaskById(id);
    }

    
    // DELETE Task by ID
    async deleteById(id: number): Promise<void> {
        const deletePage = await this.tasksRepository.delete(id);
        if (deletePage.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
    }
}
