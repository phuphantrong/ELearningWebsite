'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCourse, API_URL, createSection, updateSection, deleteSection, reorderSections, createLesson, deleteLesson, reorderLessons, updateCourse } from '@/lib/api';
import Link from 'next/link';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    order: number;
}

interface Section {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    is_published: boolean;
    price: number;
    updated_at: string;
    sections: Section[];
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'settings'
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editSectionTitle, setEditSectionTitle] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const loadCourse = async () => {
        try {
            const data = await fetchCourse(id);
            if (!data) {
                alert('Course not found');
                router.push('/admin/courses');
                return;
            }
            // Sort sections and lessons if not already sorted
            const sortedSections = data.sections?.sort((a: Section, b: Section) => a.order - b.order).map((s: Section) => ({
                ...s,
                lessons: s.lessons?.sort((a: Lesson, b: Lesson) => a.order - b.order) || []
            })) || [];

            setCourse({ ...data, sections: sortedSections });
        } catch (error) {
            console.error('Failed to load course', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCourse();
    }, [id, router]);

    // --- Section Handlers ---

    const handleAddSection = async () => {
        const title = 'New Section';
        try {
            const newSection = await createSection(id, title);
            loadCourse();
            // Optional: Auto-start editing the new section
            // setEditingSectionId(newSection.id);
            // setEditSectionTitle(newSection.title);
        } catch (err) {
            alert('Failed to create section');
        }
    };

    const handleSaveSectionTitle = async (sectionId: string) => {
        if (!editSectionTitle || editSectionTitle.trim() === '') return;
        try {
            await updateSection(sectionId, { title: editSectionTitle });
            setEditingSectionId(null);
            loadCourse();
        } catch (err) {
            alert('Failed to update section');
        }
    };

    const startEditingSection = (section: Section) => {
        setEditingSectionId(section.id);
        setEditSectionTitle(section.title);
    };

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm('Delete this section?')) return;
        try {
            await deleteSection(sectionId);
            loadCourse();
        } catch (err) {
            alert('Failed to delete section');
        }
    };

    const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
        if (!course) return;
        const sections = [...course.sections];
        if (direction === 'up' && index > 0) {
            [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
        } else if (direction === 'down' && index < sections.length - 1) {
            [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        } else {
            return;
        }

        // Optimistic update
        setCourse({ ...course, sections });

        // API update
        const reorderItems = sections.map((s, i) => ({ id: s.id, order: i + 1 }));
        try {
            await reorderSections(reorderItems);
        } catch (err) {
            loadCourse(); // Revert on fail
            console.error(err);
        }
    };

    // --- Lesson Handlers ---

    const handleAddLesson = async (sectionId: string) => {
        const title = 'Untitled Lesson';
        const slug = `untitled-lesson-${Date.now()}`;
        try {
            const newLesson = await createLesson(sectionId, title, slug);
            loadCourse();
            router.push(`/admin/lessons/${newLesson.id}`);
        } catch (err) {
            alert('Failed to create lesson');
            console.error(err);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            await deleteLesson(lessonId);
            loadCourse();
        } catch (err) {
            alert('Failed to delete lesson');
        }
    };

    const handleMoveLesson = async (sectionIndex: number, lessonIndex: number, direction: 'up' | 'down') => {
        if (!course) return;
        const sections = [...course.sections];
        const section = sections[sectionIndex];
        const lessons = [...section.lessons];

        if (direction === 'up' && lessonIndex > 0) {
            [lessons[lessonIndex], lessons[lessonIndex - 1]] = [lessons[lessonIndex - 1], lessons[lessonIndex]];
        } else if (direction === 'down' && lessonIndex < lessons.length - 1) {
            [lessons[lessonIndex], lessons[lessonIndex + 1]] = [lessons[lessonIndex + 1], lessons[lessonIndex]];
        } else {
            return;
        }

        section.lessons = lessons;
        setCourse({ ...course, sections });

        const reorderItems = lessons.map((l, i) => ({ id: l.id, order: i + 1 }));
        try {
            await reorderLessons(reorderItems);
        } catch (err) {
            loadCourse();
            console.error(err);
        }
    };


    const handleTogglePublished = async () => {
        if (!course || isUpdating) return;
        setIsUpdating(true);
        try {
            await updateCourse(id, { is_published: !course.is_published });
            // Reload full course data with sections/lessons
            await loadCourse();
        } catch (err) {
            alert('Failed to update course status');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading course...</div>;
    if (!course) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="text-slate-400 hover:text-slate-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <button
                                onClick={handleTogglePublished}
                                disabled={isUpdating}
                                className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'} ${course.is_published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {isUpdating ? '⏳ Updating...' : course.is_published ? '✓ PUBLISHED' : 'DRAFT'}
                            </button>
                            <span>•</span>
                            <span className="font-mono text-xs">{course.slug}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/courses/${course.slug}`} target="_blank" className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        Preview
                    </Link>
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-8">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('curriculum')}
                        className={`pb-4 px-1 border-b-2 font-medium transition-colors ${activeTab === 'curriculum' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Curriculum
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 px-1 border-b-2 font-medium transition-colors ${activeTab === 'settings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Course Settings
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-slate-200 min-h-[400px] p-6">
                {activeTab === 'curriculum' ? (
                    <div>
                        {course.sections.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-1">No content yet</h3>
                                <p className="text-slate-500 mb-6">Start by adding a section to organize your lessons.</p>
                                <button onClick={handleAddSection} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors">
                                    Add Section
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <button onClick={handleAddSection} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
                                        Add Section
                                    </button>
                                </div>
                                {course.sections.map((section, sIndex) => (
                                    <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
                                        <div className="bg-slate-50 p-4 flex items-center justify-between border-b border-slate-200">
                                            {editingSectionId === section.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editSectionTitle}
                                                        onChange={(e) => setEditSectionTitle(e.target.value)}
                                                        className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveSectionTitle(section.id)} className="p-1 text-green-600 hover:text-green-700">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    </button>
                                                    <button onClick={() => setEditingSectionId(null)} className="p-1 text-slate-400 hover:text-slate-600">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button onClick={() => handleMoveSection(sIndex, 'up')} disabled={sIndex === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                        </button>
                                                        <button onClick={() => handleMoveSection(sIndex, 'down')} disabled={sIndex === course.sections.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                        </button>
                                                    </div>
                                                    <h3 className="font-semibold text-slate-700 cursor-pointer hover:text-primary-600" onClick={() => startEditingSection(section)}>{section.title}</h3>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                {editingSectionId !== section.id && (
                                                    <button onClick={() => startEditingSection(section)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                                <button onClick={() => handleAddLesson(section.id)} className="ml-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-medium rounded hover:bg-slate-50">
                                                    Add Lesson
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white">
                                            {section.lessons.length === 0 ? (
                                                <p className="text-sm text-slate-400 italic pl-10">No lessons in this section.</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {section.lessons.map((lesson, lIndex) => (
                                                        <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => handleMoveLesson(sIndex, lIndex, 'up')} disabled={lIndex === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                                    </button>
                                                                    <button onClick={() => handleMoveLesson(sIndex, lIndex, 'down')} disabled={lIndex === section.lessons.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                                    </button>
                                                                </div>
                                                                <div className="w-8 h-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                                    L{lIndex + 1}
                                                                </div>
                                                                <Link href={`/admin/lessons/${lesson.id}`} className="font-medium text-slate-700 hover:text-primary-600">
                                                                    {lesson.title}
                                                                </Link>
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Link href={`/admin/lessons/${lesson.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 rounded">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                </Link>
                                                                <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                                <input
                                    type="text"
                                    defaultValue={course.title}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    defaultValue={course.description}
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    defaultValue={course.slug}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-500 font-mono text-sm"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
