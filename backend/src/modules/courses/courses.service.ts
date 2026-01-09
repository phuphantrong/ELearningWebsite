import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Section } from './entities/section.entity';
import { CourseSearchDto } from './dto/course-search.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateContentBlockDto } from './dto/create-content-block.dto';
import { UpdateContentBlockDto } from './dto/update-content-block.dto';
import { ContentBlock } from './entities/content-block.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(Lesson)
        private lessonsRepository: Repository<Lesson>,
        @InjectRepository(Section)
        private sectionsRepository: Repository<Section>,
        @InjectRepository(ContentBlock)
        private contentBlocksRepository: Repository<ContentBlock>,
    ) { }

    async findAll(query: CourseSearchDto) {
        const { q, page = 1, limit = 10, is_published } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (q) {
            where.title = Like(`%${q}%`);
        }

        // Filter by published status appropriately
        if (is_published === 'all') {
            // No filter on is_published (show both true and false)
        } else if (is_published === 'false') {
            where.is_published = false;
        } else {
            // Default to showing only published courses
            where.is_published = true;
        }

        const [data, total] = await this.coursesRepository.findAndCount({
            where,
            take: Number(limit),
            skip: Number(skip),
            order: { created_at: 'DESC' },
        });

        return {
            data,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                last_page: Math.ceil(total / limit),
            },
        };
    }

    async findOne(slug: string) {
        const course = await this.coursesRepository.findOne({
            where: { slug },
            relations: ['sections', 'sections.lessons'],
            order: {
                sections: {
                    order: 'ASC',
                    lessons: {
                        order: 'ASC'
                    }
                }
            }
        });
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async findOneById(id: string) {
        const course = await this.coursesRepository.findOne({
            where: { id },
            relations: ['sections', 'sections.lessons'],
            order: {
                sections: {
                    order: 'ASC',
                    lessons: {
                        order: 'ASC'
                    }
                }
            }
        });
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async findLesson(id: string) {
        const lesson = await this.lessonsRepository.findOne({
            where: { id },
            relations: ['content_blocks', 'section', 'section.course'],
            order: {
                content_blocks: {
                    order: 'ASC',
                },
            },
        });

        if (!lesson) throw new NotFoundException('Lesson not found');
        return lesson;
    }

    async create(createCourseDto: CreateCourseDto) {
        const course = this.coursesRepository.create(createCourseDto);
        return this.coursesRepository.save(course);
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        const course = await this.coursesRepository.findOne({ where: { id } });
        if (!course) throw new NotFoundException('Course not found');

        Object.assign(course, updateCourseDto);
        return this.coursesRepository.save(course);
    }

    async remove(id: string) {
        const result = await this.coursesRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Course not found');
        return { message: 'Course deleted successfully' };
    }

    // --- Sections ---

    async createSection(courseId: string, createSectionDto: CreateSectionDto) {
        const course = await this.coursesRepository.findOne({ where: { id: courseId } });
        if (!course) throw new NotFoundException('Course not found');

        const section = this.sectionsRepository.create({
            ...createSectionDto,
            course,
        });

        // Auto-assign order if not provided
        if (section.order === undefined) {
            const count = await this.sectionsRepository.count({ where: { course: { id: courseId } } });
            section.order = count + 1;
        }

        return this.sectionsRepository.save(section);
    }

    async updateSection(id: string, updateSectionDto: UpdateSectionDto) {
        const section = await this.sectionsRepository.findOne({ where: { id } });
        if (!section) throw new NotFoundException('Section not found');

        Object.assign(section, updateSectionDto);
        return this.sectionsRepository.save(section);
    }

    async removeSection(id: string) {
        const result = await this.sectionsRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Section not found');
        return { message: 'Section deleted successfully' };
    }

    async reorderSections(items: { id: string; order: number }[]) {
        // Simple iteration update (for Phase 1). Transaction recommended for production.
        for (const item of items) {
            await this.sectionsRepository.update(item.id, { order: item.order });
        }
        return { message: 'Sections reordered' };
    }

    // --- Lessons ---

    async createLesson(sectionId: string, createLessonDto: CreateLessonDto) {
        const section = await this.sectionsRepository.findOne({ where: { id: sectionId } });
        if (!section) throw new NotFoundException('Section not found');

        const lesson = this.lessonsRepository.create({
            type: 'text',
            ...createLessonDto,
            section,
        });

        // Auto-assign order
        if (lesson.order === undefined) {
            const count = await this.lessonsRepository.count({ where: { section: { id: sectionId } } });
            lesson.order = count + 1;
        }

        return this.lessonsRepository.save(lesson);
    }

    async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
        const lesson = await this.lessonsRepository.findOne({ where: { id } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        Object.assign(lesson, updateLessonDto);
        return this.lessonsRepository.save(lesson);
    }

    async removeLesson(id: string) {
        const result = await this.lessonsRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Lesson not found');
        return { message: 'Lesson deleted successfully' };
    }

    async reorderLessons(items: { id: string; order: number }[]) {
        for (const item of items) {
            await this.lessonsRepository.update(item.id, { order: item.order });
        }
        return { message: 'Lessons reordered' };
    }

    // --- Content Blocks ---

    async createBlock(lessonId: string, createBlockDto: CreateContentBlockDto) {
        const lesson = await this.lessonsRepository.findOne({ where: { id: lessonId } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        const block = this.contentBlocksRepository.create({
            ...createBlockDto,
            lesson,
        });

        if (block.order === undefined) {
            const count = await this.contentBlocksRepository.count({ where: { lesson: { id: lessonId } } });
            block.order = count + 1;
        }

        return this.contentBlocksRepository.save(block);
    }

    async updateBlock(id: string, updateBlockDto: UpdateContentBlockDto) {
        const block = await this.contentBlocksRepository.findOne({ where: { id } });
        if (!block) throw new NotFoundException('Block not found');

        Object.assign(block, updateBlockDto);
        return this.contentBlocksRepository.save(block);
    }

    async removeBlock(id: string) {
        const result = await this.contentBlocksRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Block not found');
        return { message: 'Block deleted successfully' };
    }

    async reorderBlocks(items: { id: string; order: number }[]) {
        for (const item of items) {
            await this.contentBlocksRepository.update(item.id, { order: item.order });
        }
        return { message: 'Blocks reordered' };
    }
}
