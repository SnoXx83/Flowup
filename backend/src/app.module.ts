import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjetsModule } from './projets/projets.module';
import { PagesModule } from './pages/pages.module';
import { BlocsModule } from './blocs/blocs.module';
import { BlocEntity } from './blocs/bloc.entity/bloc.entity';
import { PageEntity } from './pages/pages.entity/page.entity';
import { ProjectEntity } from './projets/projets.entity/project.entity';
import { UserEntity } from './users/entities/user.entity';

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
      entities:[UserEntity, ProjectEntity, PageEntity, BlocEntity],
    }),
    UsersModule,
    ProjetsModule,
    PagesModule,
    BlocsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
