import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BlocsService } from './blocs.service';
import { BlocEntity } from './blocs.entity/blocs.entity';

@Controller('blocs')
export class BlocsController {
    constructor(private readonly blocsService: BlocsService) { }

    @Get()
    async findAll(): Promise<BlocEntity[]> {
        return this.blocsService.findAll();
    }

    @Post()
    async create(@Body() blocPayload: BlocEntity): Promise<BlocEntity>{
        return this.blocsService.create(blocPayload);
    }

    @Get(':id')
    async readOne(@Param('id') id:number): Promise<BlocEntity>{
        return this.blocsService.BlocById(id);
    }

    @Put(':id') 
    async update(
        @Param('id') id: number, @Body() blocData: Partial<BlocEntity>
    ): Promise<BlocEntity> {
        return this.blocsService.updateBloc(id, blocData);
    }

    @Delete(':id')
    async delete(@Param('id') id: number){
        return this.blocsService.deleteById(id);
    }
    
}
