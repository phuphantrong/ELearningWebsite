import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Course } from './modules/courses/entities/course.entity';
import { Section } from './modules/courses/entities/section.entity';
import { Lesson } from './modules/courses/entities/lesson.entity';
import { ContentBlock } from './modules/courses/entities/content-block.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    const courseRepo = dataSource.getRepository(Course);
    const sectionRepo = dataSource.getRepository(Section);
    const lessonRepo = dataSource.getRepository(Lesson);
    const blockRepo = dataSource.getRepository(ContentBlock);

    console.log('Seeding data...');

    // Clear existing data
    // Use delete with logic that matches everything or query for all IDs if clear() has issues with foreign keys, 
    // but clear() is best for truncation. 
    // However, clear() might not cascade in some drivers. 
    // Safe approach: delete all by criteria that matches everything, e.g. "id IS NOT NULL" or similar, 
    // but TypeORM delete({}) *should* work if not disallowed.
    // The error is specific. Let's try query or clear.
    // Given foreign keys, we need to delete in order: blocks -> lessons -> sections -> courses.
    // clear() does not cascade.

    // Using query is most robust for seed reset:
    await blockRepo.query(`TRUNCATE TABLE "content_blocks" RESTART IDENTITY CASCADE`);
    await lessonRepo.query(`TRUNCATE TABLE "lessons" RESTART IDENTITY CASCADE`);
    await sectionRepo.query(`TRUNCATE TABLE "sections" RESTART IDENTITY CASCADE`);
    await courseRepo.query(`TRUNCATE TABLE "courses" RESTART IDENTITY CASCADE`);

    try {
        const dataPath = path.join(__dirname, '..', 'seed_data.json');
        console.log(`Reading seed data from ${dataPath}`);
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const courses = JSON.parse(fileContent);

        for (const courseData of courses) {
            console.log(`Creating course: ${courseData.title}`);
            const { sections, ...courseInfo } = courseData;

            // Create Course
            const savedCourse = await courseRepo.save(courseInfo);

            if (sections && sections.length > 0) {
                for (const sectionData of sections) {
                    const { lessons, ...sectionInfo } = sectionData;
                    // Create Section
                    const savedSection = await sectionRepo.save({
                        ...sectionInfo,
                        course: savedCourse,
                    });

                    if (lessons && lessons.length > 0) {
                        for (const lessonData of lessons) {
                            const { content_blocks, ...lessonInfo } = lessonData;
                            // Create Lesson
                            const savedLesson = await lessonRepo.save({
                                ...lessonInfo,
                                section: savedSection,
                            });

                            if (content_blocks && content_blocks.length > 0) {
                                // Create ContentBlocks
                                const blocksToSave = content_blocks.map((block: any) => ({
                                    ...block,
                                    lesson: savedLesson,
                                }));
                                await blockRepo.save(blocksToSave);
                            }
                        }
                    }
                }
            }
        }
        console.log('Seeding complete successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }

    await app.close();
}
bootstrap();
