import { Body, Controller, Delete, Get, Param, Patch, Post, Req} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './tasks.entity/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserEntity } from 'src/users/users.entity/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';


interface AuthenticatedRequest extends Request {
    user: UserEntity;
}

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    async findAll() {
        return this.tasksService.findAll();
    }

    @Get('project/:projectId')
    async findTasksByProject(@Param('projectId') projectId: string): Promise<TaskEntity[]> {
        return this.tasksService.findTasksByProjectId(+projectId);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<TaskEntity> {
        return this.tasksService.TaskById(id);
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
    async update(
        @Param('id') id: number,
        @Body() pageData: UpdateTaskDto
    ): Promise<TaskEntity> {
        return this.tasksService.updateTask(id, pageData);
    }


    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.tasksService.deleteById(id)
    }
}
