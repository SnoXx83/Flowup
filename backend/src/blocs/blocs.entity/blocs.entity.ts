import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskEntity } from 'src/tasks/tasks.entity/tasks.entity';


@Entity()
export class BlocEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => TaskEntity, (task) => task.blocs, { onDelete: "CASCADE" })
  task: TaskEntity;
}