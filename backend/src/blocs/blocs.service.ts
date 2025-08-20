import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlocEntity } from './bloc.entity/bloc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlocsService {
    constructor(
        @InjectRepository(BlocEntity)
        private blocsRepository: Repository<BlocEntity>,
    ) { }

    async findAll(): Promise<BlocEntity[]> {
        const allBlocs = this.blocsRepository.find();

        if (!allBlocs) {
            throw new Error("Bloc not found !");
        }

        return allBlocs;
    }

    async create(blocPayload: Partial<BlocEntity>): Promise<BlocEntity> {
        const newBloc = this.blocsRepository.create(blocPayload);
        return this.blocsRepository.save(newBloc);
    }

    async BlocById(id: number): Promise<BlocEntity> {
        const bloc = await this.blocsRepository.findOne({ where: { id } });
        if (!bloc) {
            throw new NotFoundException(`Bloc with ID "${id}" not found.`);
        }
        return bloc;
    }

    async deleteById(id: number): Promise<void> {
        const deleteBloc = await this.blocsRepository.delete(id);
        if (deleteBloc.affected === 0) {
            throw new NotFoundException(`Bloc with ID "${id}" not found.`);
        }
    }

    async updateBloc(id: number, blocData: Partial<BlocEntity>): Promise<BlocEntity> {
        const blocToUpdate = await this.blocsRepository.findOneBy({ id });

        if (!blocToUpdate) {
            throw new NotFoundException("Bloc not found !");
        }

        Object.assign(blocToUpdate, blocData);

        const updateBloc = await this.blocsRepository.save(blocToUpdate);

        return updateBloc;
    }


}
