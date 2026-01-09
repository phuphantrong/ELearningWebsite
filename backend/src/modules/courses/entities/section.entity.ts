import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('sections')
export class Section {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ default: 0 })
    order: number;

    @Column()
    course_id: string;

    @ManyToOne(() => Course, (course) => course.sections, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @OneToMany(() => Lesson, (lesson) => lesson.section)
    lessons: Lesson[];
}
