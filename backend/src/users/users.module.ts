import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity/user.entity';
import { ProjectEntity } from 'src/projects/projects.entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProjectEntity])],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
