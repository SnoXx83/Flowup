import { TaskEntity } from "src/tasks/tasks.entity/tasks.entity";
import { UserEntity } from "src/users/users.entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    dateOfCreation: Date;

    @Column({ nullable: true })
    members: string;

    @ManyToOne(() => UserEntity, (user) => user.projects)
    user: UserEntity;

    @OneToMany(() => TaskEntity, (task) => task.project)
    tasks: TaskEntity[];
}
