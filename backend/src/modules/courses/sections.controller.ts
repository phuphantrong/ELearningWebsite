import { Controller, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('api/v1')
export class SectionsController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post('courses/:courseId/sections')
    create(@Param('courseId') courseId: string, @Body() createSectionDto: CreateSectionDto) {
        return this.coursesService.createSection(courseId, createSectionDto);
    }

    @Patch('sections/:id')
    update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
        return this.coursesService.updateSection(id, updateSectionDto);
    }

    @Delete('sections/:id')
    remove(@Param('id') id: string) {
        return this.coursesService.removeSection(id);
    }

    @Put('sections/reorder')
    reorder(@Body() body: { items: { id: string; order: number }[] }) {
        return this.coursesService.reorderSections(body.items);
    }
}
