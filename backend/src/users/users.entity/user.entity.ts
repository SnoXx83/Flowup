import { PageEntity } from "src/pages/pages.entity/page.entity";
import { ProjectEntity } from "src/projects/projects.entity/project.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    imageUrl: string;

    @OneToMany(() => ProjectEntity, (project) => project.user)
    projects: ProjectEntity[];

    @OneToMany(() => PageEntity, (page) => page.project)
    pages: PageEntity[];
}
