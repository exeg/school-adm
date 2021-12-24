import { Controller, Get, Post } from '@nestjs/common';
import { StudyGroup } from './groups.entity';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async save(group: StudyGroup): Promise<StudyGroup> {
    return await this.groupsService.create(group);
  }

  @Get('list')
  async load(): Promise<StudyGroup[]> {
    return await this.groupsService.findAll();
  }
}
