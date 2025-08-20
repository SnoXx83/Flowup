import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PageEntity } from './pages.entity/page.entity';

@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Get()
    async findAll(): Promise<PageEntity[]> {
        return this.pagesService.findAll();
    }

    @Post()
    async create(@Body() pagePayload: PageEntity): Promise<PageEntity> {
        return this.pagesService.create(pagePayload);
    }

    @Get(':id')
    async readOne(@Param('id') id: number): Promise<PageEntity> {
        return this.pagesService.PageById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number, @Body() pageData: Partial<PageEntity>
    ): Promise<PageEntity> {
        return this.pagesService.updatePage(id, pageData);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.pagesService.deleteById(id)
    }
}
