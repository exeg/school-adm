import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { StudyGroup } from './groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyGroup])],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
