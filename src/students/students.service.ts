import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mailman, MailMessage } from '@squareboat/nest-mailman';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { StudyGroup } from 'src/groups/groups.entity';
import { Repository } from 'typeorm';
import { Student } from './students.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(StudyGroup)
    private groupRepository: Repository<StudyGroup>,
  ) {}

  async sendEmail(name: string, email: string, topic: string): Promise<void> {
    const user = { name: name };
    const mail = MailMessage.init()
      .subject(`${name}, ${topic}`)
      .view('notify2', user);
    await Mailman.init()
      .to(email) // OR .to(['id1@email.com', 'id2@email.com'])
      .send(mail);
  }

  async getStudentRel(id: number): Promise<Student> {
    return await this.studentRepository
      .find({
        relations: ['groups'],
        where: { id: id },
      })
      .then((v) => v[0]);
  }

  async remFromGroup(studentId: number, groupId: number): Promise<Student> {
    const student = await this.getStudentRel(studentId);

    const i = student.groups.map((e) => e.id).indexOf(groupId);
    if (i !== -1) student.groups.splice(i, 1);
    await this.sendEmail(student.name, student.email, 'You removed from group');
    return await this.studentRepository.save(student);
  }

  async addToGroup(studentId: number, groupId: number): Promise<Student> {
    const student = await this.getStudentRel(studentId);

    if (student.groups.length >= 4) {
      return student;
    } else {
      const gr = await this.groupRepository.findOne(groupId);
      student.groups.push(gr);
      await this.sendEmail(student.name, student.email, 'You added to group');
      return await this.studentRepository.save(student);
    }
  }

  async create(student: Student): Promise<Student> {
    await this.sendEmail(student.name, student.email, 'Welcome to our school');
    return await this.studentRepository.save(student);
  }

  async delete(id: number): Promise<any> {
    const student = await this.getStudentRel(id);
    await this.sendEmail(student.name, student.email, 'Bye bye');
    return await this.studentRepository.delete(id);
  }

  async update(student: Partial<Student>): Promise<Student> {
    if (student.groups) {
      const actualRelationships = await this.studentRepository
        .createQueryBuilder()
        .relation(Student, 'groups')
        .of(student)
        .loadMany();

      await this.studentRepository
        .createQueryBuilder()
        .relation(Student, 'groups')
        .of(student)
        .addAndRemove(student.groups, actualRelationships);
    }

    await this.studentRepository.save(student);
    await this.sendEmail(student.name, student.email, 'Your courses changed');
    return await this.getStudentRel(student.id);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    name?: string,
    group?: string | Array<string>,
  ): Promise<Student[]> {
    const { limit, offset } = paginationQuery;

    const query = this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.groups', 'StudyGroup')
      .leftJoinAndSelect('student.groups', 'StudyGroupSelect');
    if (name) {
      query.where('student.name = :name', { name: name });
    }
    if (group) {
      if (Array.isArray(group)) {
        const groupArr = group.map((x) => Number(x));
        if (name) {
          query.andWhere('StudyGroup.id IN (:...ids)', { ids: groupArr });
        } else {
          query.where('StudyGroup.id IN (:...ids)', { ids: groupArr });
        }
      } else {
        if (name) {
          query.andWhere('StudyGroup.id = :id', { id: Number(group) });
        } else {
          query.where('StudyGroup.id = :id', { id: Number(group) });
        }
      }
    }
    query.limit(limit);
    if (offset) query.offset(offset);
    return await query.getMany();
  }
}
