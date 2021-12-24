import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyGroup } from './groups.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(StudyGroup)
    private groupRepository: Repository<StudyGroup>,
  ) {}

  async create(group: StudyGroup): Promise<StudyGroup> {
    return await this.groupRepository.save(group);
  }

  async findAll(): Promise<StudyGroup[]> {
    return await this.groupRepository.find();
  }
}
