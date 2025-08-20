import { Module } from '@nestjs/common';
import { BlocsService } from './blocs.service';
import { BlocsController } from './blocs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlocEntity } from './bloc.entity/bloc.entity';
import { PageEntity } from 'src/pages/pages.entity/page.entity';

@Module({
  imports: [
          TypeOrmModule.forFeature([BlocEntity, PageEntity]),
      ],
  providers: [BlocsService],
  controllers: [BlocsController]
})
export class BlocsModule {}
