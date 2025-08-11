import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Récupère tout les users
    @Get()
    async findAll(): Promise<UserEntity[]>{
        return this.usersService.findAll();
    }

    // Crée un nouveau user
    @Post()
    async create(@Body() userPayload: UserEntity): Promise<UserEntity> {
        return this.usersService.create(userPayload);
    }

    // Récupère un user selon son ID
    @Get(':id')
    async readOne(@Param('id') id: number): Promise<UserEntity>{
        return this.usersService.readById(id);
    }

    // Modifie un user selon son ID
    @Put(':id')
    async update(
        @Param('id') id: number, @Body() userData: Partial<UserEntity>
    ): Promise<UserEntity>{
        return this.usersService.updateUser(id, userData);
    }

    // Supprime un user selon son ID
    @Delete(':id')
    async delete(@Param('id') id: number){
        return this.usersService.deleteById(id);
    }
}
