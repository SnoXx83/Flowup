import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) { }

    async findAll(): Promise<UserEntity[]>{
        const allUsers= this.usersRepository.find();

        if(!allUsers){
            throw new Error("User not found !");
        }

        return allUsers;
    }

    async create(userPayload: Partial<UserEntity>): Promise<UserEntity> {
        const newUser = this.usersRepository.create(userPayload);
        return this.usersRepository.save(newUser);
    }

    async readById(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found.`);
        }
        return user;
    }

    async deleteById(id: number) {
        const deleteUser = this.usersRepository.delete(id);
    }

    async updateUser(id: number, userData: Partial<UserEntity>){
        const userToUpdate= await this.usersRepository.findOneBy({id});

        if(!userToUpdate){
            throw new Error("User not found !");
        }

        // copie les nouvelles données dans l'objet existant
        Object.assign(userToUpdate, userData);

        const updatedUser= await this.usersRepository.save(userToUpdate);

        return updatedUser;
    }
}
