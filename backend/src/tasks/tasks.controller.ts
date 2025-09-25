import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './tasks.entity/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserEntity } from 'src/users/users.entity/user.entity';


interface AuthenticatedRequest extends Request {
    user: UserEntity;
}

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    async findAll(): Promise<TaskEntity[]> {
        return this.tasksService.findAll();
    }

    @Get('project/:projectId')
    async findTasksByProject(@Param('projectId') projectId: string): Promise<TaskEntity[]> {
        return this.tasksService.findTasksByProjectId(+projectId);
    }

    @Post(':projectId')
    async create(
        @Param('projectId') projectId: string,
        @Body() createTaskDto: CreateTaskDto,
        @Req() req: AuthenticatedRequest
    ) {
        return this.tasksService.create(createTaskDto, req.user, + projectId);
    }

    @Patch(':id')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.tasksService.updateTaskStatus(+id, status);
    }


    @Get(':id')
    async readOne(@Param('id') id: number): Promise<TaskEntity> {
        return this.tasksService.PageById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number, @Body() pageData: Partial<TaskEntity>
    ): Promise<TaskEntity> {
        return this.tasksService.updateTask(id, pageData);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.tasksService.deleteById(id)
    }
}
