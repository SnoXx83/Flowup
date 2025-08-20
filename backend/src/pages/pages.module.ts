import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageEntity } from './pages.entity/page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity]),
  ],
  providers: [PagesService],
  controllers: [PagesController]
})
export class PagesModule { }
