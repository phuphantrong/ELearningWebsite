'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

// Mock types for now, will replace with real API
interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    is_published: boolean;
    updated_at: string;
    sections: any[];
}

export default function AdminCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseSlug, setNewCourseSlug] = useState('');

    const fetchCourses = () => {
        setIsLoading(true);
        // Direct fetch to backend for Admin
        // In real app, consider using Server Actions or React Query
        fetch(`${API_URL}/courses?is_published=all`)
            .then(res => res.json())
            .then(data => {
                setCourses(data.data || []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setNewCourseTitle(title);
        setNewCourseSlug(generateSlug(title));
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const res = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newCourseTitle,
                    slug: newCourseSlug,
                    description: '', // Optional for now
                    is_published: false
                })
            });

            if (!res.ok) throw new Error('Failed to create course');

            const newCourse = await res.json();

            // Close modal and refresh list
            setIsModalOpen(false);
            setNewCourseTitle('');
            setNewCourseSlug('');
            fetchCourses(); // Refresh list

            // Optional: Redirect to edit page immediately
            // router.push(`/admin/courses/${newCourse.id}`);

        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
                    <p className="text-slate-500">Manage your learning content</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Course
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="relative group">
                            <Link href={`/admin/courses/${course.id}`} className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-500 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${course.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {course.is_published ? 'PUBLISHED' : 'DRAFT'}
                                    </div>
                                    <div className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 mb-2 truncate">{course.title}</h3>
                                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{course.description || 'No description provided.'}</p>

                                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-50">
                                    <span>{new Date(course.updated_at).toLocaleDateString()}</span>
                                    <span>{course.sections?.length || 0} SECTIONS</span>
                                </div>
                            </Link>
                            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete this course?')) {
                                            fetch(`${API_URL}/courses/${course.id}`, { method: 'DELETE' })
                                                .then(() => fetchCourses());
                                        }
                                    }}
                                    className="p-2 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Create Course Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-900">Create New Course</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={newCourseTitle}
                                            onChange={handleTitleChange}
                                            placeholder="e.g. Advanced React Patterns"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            required
                                            value={newCourseSlug}
                                            onChange={(e) => setNewCourseSlug(e.target.value)}
                                            placeholder="e.g. advanced-react-patterns"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono text-sm"
                                        />
                                    </div>
                                    <div className="pt-2 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isCreating}
                                            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isCreating && (
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            Create Course
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
