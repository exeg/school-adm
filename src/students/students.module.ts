import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from 'src/groups/groups.module';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './students.entity';
import { StudyGroup } from 'src/groups/groups.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forFeature([StudyGroup]),
    GroupsModule,
  ],
  providers: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
