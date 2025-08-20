import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEntity } from './pages.entity/page.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagesService {
    constructor(
        @InjectRepository(PageEntity)
        private pagesRepository: Repository<PageEntity>,
    ) { }

    async findAll(): Promise<PageEntity[]> {
        const allPages = this.pagesRepository.find();

        if (!allPages) {
            throw new Error("Page not found !");
        }

        return allPages;
    }

    async create(pagePayload: Partial<PageEntity>): Promise<PageEntity> {
        const newPage = this.pagesRepository.create(pagePayload);

        return this.pagesRepository.save(newPage);
    }

    async PageById(id: number): Promise<PageEntity> {
        const page = await this.pagesRepository.findOne({ where: { id } });

        if (!page) {
            throw new NotFoundException(`Page with ID "${id}" not found.`);
        }

        return page;
    }

    async updatePage(id: number, pageData: Partial<PageEntity>) {
        const pageToUpdate = await this.pagesRepository.findOneBy({ id });

        if (!pageToUpdate) {
            throw new NotFoundException("Page not found !");
        }

        Object.assign(pageToUpdate, pageData);

        const updatePage = await this.pagesRepository.save(pageToUpdate);

        return updatePage;
    }

    async deleteById(id: number): Promise<void> {
        const deletePage = await this.pagesRepository.delete(id);
        if (deletePage.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
    }
}
