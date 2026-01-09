import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Section } from './section.entity';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column('text', { default: '' })
    description: string;

    @Column({ default: 0 })
    price: number;

    @Column({ default: false })
    is_published: boolean;

    // New Fields for Design System
    @Column({ default: 'Admin' })
    author_name: string;

    @Column({ nullable: true })
    author_avatar: string;

    @Column('float', { default: 0 })
    rating: number;

    @Column({ default: 0 })
    rating_count: number;

    @Column({ type: 'text', default: 'Beginner' }) // 'Beginner' | 'Intermediate' | 'Advanced'
    level: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Section, (section) => section.course, { cascade: true })
    sections: Section[];
}
