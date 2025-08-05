import { BlocEntity } from "src/blocs/entities/bloc.entity/bloc.entity";
import { ProjectEntity } from "src/projets/entities/project.entity/project.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => ProjectEntity, (project) => project.pages)
    project: ProjectEntity;

    @OneToMany(() => BlocEntity, (bloc) => bloc.page)
    blocs: BlocEntity[];
}