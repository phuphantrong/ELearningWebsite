import { Controller, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('api/v1')
export class LessonsController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post('sections/:sectionId/lessons')
    create(@Param('sectionId') sectionId: string, @Body() createLessonDto: CreateLessonDto) {
        return this.coursesService.createLesson(sectionId, createLessonDto);
    }

    @Patch('lessons/:id')
    update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
        return this.coursesService.updateLesson(id, updateLessonDto);
    }

    @Delete('lessons/:id')
    remove(@Param('id') id: string) {
        return this.coursesService.removeLesson(id);
    }

    @Put('lessons/reorder')
    reorder(@Body() body: { items: { id: string; order: number }[] }) {
        return this.coursesService.reorderLessons(body.items);
    }
}
