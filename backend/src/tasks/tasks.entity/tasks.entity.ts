import { BlocEntity } from "src/blocs/bloc.entity/bloc.entity";
import { ProjectEntity } from "src/projects/projects.entity/project.entity";
import { UserEntity } from "src/users/users.entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: 'À faire' })
    status: string;

    // Relation to the User who created the task
    @ManyToOne(() => UserEntity, user => user.tasks, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => ProjectEntity, (project) => project.tasks)
    project: ProjectEntity;

    @OneToMany(() => BlocEntity, (bloc) => bloc.task, {onDelete: 'CASCADE'})
    blocs: BlocEntity[];
}