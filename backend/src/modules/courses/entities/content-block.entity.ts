import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('content_blocks')
export class ContentBlock {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    lesson_id: string;

    @Column()
    type: string; // 'text', 'video', 'image', 'code'

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @Column({ default: 0 })
    order: number;

    @ManyToOne(() => Lesson, (lesson) => lesson.content_blocks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_id' })
    lesson: Lesson;
}
