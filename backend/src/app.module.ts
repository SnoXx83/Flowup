import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { BlocsModule } from './blocs/blocs.module';
import { BlocEntity } from './blocs/blocs.entity/blocs.entity';
import { TaskEntity } from './tasks/tasks.entity/tasks.entity';
import { ProjectEntity } from './projects/projects.entity/project.entity';
import { UserEntity } from './users/users.entity/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nestuser',
      password: 'nestpassword',
      database: 'nest_db',
      autoLoadEntities: true,
      synchronize: true, // Mettre à 'false' en production !
      entities:[UserEntity, ProjectEntity, TaskEntity, BlocEntity],
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
    BlocsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
