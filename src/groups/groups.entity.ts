import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('groups')
export class StudyGroup {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', { name: 'name', nullable: false })
  name: string;

  @Column()
  leader: string;

  @Column()
  subject: string;

  @Column()
  date: Date;
}
