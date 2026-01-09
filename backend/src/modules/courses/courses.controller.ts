import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseSearchDto } from './dto/course-search.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('api/v1')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Get('courses')
    findAll(@Query() query: CourseSearchDto) {
        return this.coursesService.findAll(query);
    }

    @Get('courses/:slug')
    findOne(@Param('slug') slug: string) {
        return this.coursesService.findOne(slug);
    }

    @Get('courses/id/:id')
    findOneById(@Param('id') id: string) {
        return this.coursesService.findOneById(id);
    }

    @Get('lessons/:id')
    findLesson(@Param('id') id: string) {
        return this.coursesService.findLesson(id);
    }

    @Post('courses')
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto);
    }

    @Patch('courses/:id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete('courses/:id')
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }

    // --- Sections ---

    @Post('courses/:courseId/sections')
    createSection(@Param('courseId') courseId: string, @Body() createSectionDto: any) { // Import DTO properly in final version if possible, or use any given constraints
        // Using any here for brevity but should import CreateSectionDto
        return this.coursesService.createSection(courseId, createSectionDto);
    }

    @Patch('sections/reorder')
    reorderSections(@Body() items: { id: string; order: number }[]) {
        return this.coursesService.reorderSections(items);
    }

    @Patch('sections/:id')
    updateSection(@Param('id') id: string, @Body() updateSectionDto: any) {
        return this.coursesService.updateSection(id, updateSectionDto);
    }

    @Delete('sections/:id')
    removeSection(@Param('id') id: string) {
        return this.coursesService.removeSection(id);
    }

    // --- Lessons ---

    @Post('sections/:sectionId/lessons')
    createLesson(@Param('sectionId') sectionId: string, @Body() createLessonDto: any) {
        return this.coursesService.createLesson(sectionId, createLessonDto);
    }

    @Patch('lessons/reorder')
    reorderLessons(@Body() items: { id: string; order: number }[]) {
        return this.coursesService.reorderLessons(items);
    }

    @Patch('lessons/:id')
    updateLesson(@Param('id') id: string, @Body() updateLessonDto: any) {
        return this.coursesService.updateLesson(id, updateLessonDto);
    }

    @Delete('lessons/:id')
    removeLesson(@Param('id') id: string) {
        return this.coursesService.removeLesson(id);
    }

    // --- Content Blocks ---

    @Post('lessons/:lessonId/blocks')
    createBlock(@Param('lessonId') lessonId: string, @Body() createBlockDto: any) {
        return this.coursesService.createBlock(lessonId, createBlockDto);
    }

    @Patch('blocks/reorder')
    reorderBlocks(@Body() items: { id: string; order: number }[]) {
        return this.coursesService.reorderBlocks(items);
    }

    @Patch('blocks/:id')
    updateBlock(@Param('id') id: string, @Body() updateBlockDto: any) {
        return this.coursesService.updateBlock(id, updateBlockDto);
    }

    @Delete('blocks/:id')
    removeBlock(@Param('id') id: string) {
        return this.coursesService.removeBlock(id);
    }
}
