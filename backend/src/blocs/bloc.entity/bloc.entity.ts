import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PageEntity } from 'src/pages/pages.entity/page.entity';

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

  @ManyToOne(() => PageEntity, (page) => page.blocs)
  page: PageEntity;
}