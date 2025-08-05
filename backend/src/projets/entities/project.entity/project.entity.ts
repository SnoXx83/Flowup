import { PageEntity } from "src/pages/entities/page.entity/page.entity";
import { UserEntity } from "src/users/entities/user.entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    dateOfCreation: string;

    @Column()
    creator: string;

    @Column()
    members: string;

    @ManyToOne(() => UserEntity, (user) => user.projects)
    user: UserEntity;

    @OneToMany(() => PageEntity, (page) => page.project)
    pages: PageEntity[];
}
