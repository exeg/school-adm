import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Student } from 'src/students/students.entity';
import { StudentsService } from 'src/students/students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async save(@Body() student: Student): Promise<Student> {
    return await this.studentsService.create(student);
  }

  @Get('list')
  async load(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('name') name?: string,
    @Query('group') group?: string,
  ): Promise<any> {
    if (!paginationQuery.limit) paginationQuery.limit = 10;
    return await this.studentsService.findAll(paginationQuery, name, group);
  }

  @Delete('group/:sid/:gid')
  async fromGroup(
    @Param('sid') studentId: number,
    @Param('gid') groupId: number,
  ): Promise<Student> {
    return this.studentsService.remFromGroup(studentId, groupId);
  }

  @Get('group/:sid/:gid')
  async toGroup(
    @Param('sid') studentId: number,
    @Param('gid') groupId: number,
  ): Promise<Student> {
    return this.studentsService.addToGroup(studentId, groupId);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.studentsService.delete(id);
  }

  @Put()
  async update(@Body() student: Partial<Student>): Promise<Student> {
    return await this.studentsService.update(student);
  }
}
