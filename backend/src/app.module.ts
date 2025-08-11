import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjetsModule } from './projets/projets.module';
import { PagesModule } from './pages/pages.module';
import { BlocsModule } from './blocs/blocs.module';

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
