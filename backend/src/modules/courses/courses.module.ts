import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { SectionsController } from './sections.controller';
import { LessonsController } from './lessons.controller';
import { ContentBlocksController } from './content-blocks.controller';
import { Section } from './entities/section.entity';
import { Lesson } from './entities/lesson.entity';
import { ContentBlock } from './entities/content-block.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course, Section, Lesson, ContentBlock])],
    controllers: [CoursesController, SectionsController, LessonsController, ContentBlocksController],



    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule { }
