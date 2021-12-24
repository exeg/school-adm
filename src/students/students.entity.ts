import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { StudyGroup } from 'src/groups/groups.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  sex: string;

  @Column()
  date: Date;

  @Column()
  place: string;

  @Column()
  @IsEmail()
  email: string;

  @ManyToMany(() => StudyGroup, { cascade: true })
  @JoinTable()
  groups?: StudyGroup[];
}
