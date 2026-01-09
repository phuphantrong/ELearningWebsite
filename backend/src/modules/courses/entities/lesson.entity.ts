import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Section } from './section.entity';
import { ContentBlock } from './content-block.entity';

@Entity('lessons')
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ default: 'text' })
    type: string; // video, text, quiz

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ nullable: true })
    video_url: string;

    @Column({ default: 0 })
    duration: number;

    @Column({ default: 0 })
    order: number;

    @Column({ default: false })
    is_free: boolean;

    @Column()
    section_id: string;

    @ManyToOne(() => Section, (section) => section.lessons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'section_id' })
    section: Section;

    @OneToMany(() => ContentBlock, (block) => block.lesson)
    content_blocks: ContentBlock[];
}
