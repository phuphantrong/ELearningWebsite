'use client';

import Link from "next/link";
import { fetchLesson, fetchCourseBySlug } from "@/lib/api";
import ContentBlockRenderer from "@/components/ContentBlockRenderer";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function LessonPage({ params, lessonData, courseData }: {
    params: { courseId: string; lessonId: string };
    lessonData: any;
    courseData: any;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { courseId } = params;
    const lesson = lessonData;
    const course = courseData.course;
    const prevLesson = courseData.prevLesson;
    const nextLesson = courseData.nextLesson;
    const allLessons = courseData.allLessons;
    const progressPercentage = courseData.progressPercentage;

    if (!lesson) notFound();

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden relative">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Left Sidebar (Navigation) - Responsive */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-80 md:w-80 lg:w-80 bg-slate-50 border-r border-slate-200
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col h-full
            `}>
                <div className="p-4 md:p-5 border-b border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-3 lg:mb-2">
                        <Link href={`/courses/${course?.slug}`} className="text-xs md:text-sm font-medium text-slate-500 hover:text-primary-600 touch-target">
                            ← Back to Course
                        </Link>
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <h2 className="font-bold text-slate-900 leading-tight text-sm md:text-base line-clamp-2">{course?.title}</h2>
                    <div className="mt-3 md:mt-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>{progressPercentage}% Completed</span>
                            <span>{allLessons?.length || 0} lessons</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
                    {course?.sections?.sort((a: any, b: any) => a.order - b.order).map((section: any) => (
                        <div key={section.id}>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 md:mb-3 px-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.lessons?.sort((a: any, b: any) => a.order - b.order).map((l: any) => {
                                    const isActive = l.id === lesson.id;
                                    return (
                                        <Link
                                            key={l.id}
                                            href={`/learn/${courseId}/${l.id}`}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`
                                                group flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all touch-target
                                                ${isActive
                                                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                                }
                                            `}
                                        >
                                            {isActive ? (
                                                <svg className="w-4 h-4 md:w-5 md:h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            ) : (
                                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-slate-300 flex-shrink-0 group-hover:border-slate-400"></div>
                                            )}
                                            <span className="line-clamp-2 leading-relaxed">{l.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-full bg-white relative">
                {/* Mobile Header with Menu Toggle */}
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-600 hover:text-slate-900 p-1 -ml-1 touch-target"
                        aria-label="Toggle lesson menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-sm font-semibold text-slate-900 line-clamp-1 flex-1">{lesson.title}</h1>
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
                    {/* Header - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:block mb-8 pb-8 border-b border-slate-100">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{lesson.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Author: Admin</span>
                            <span>•</span>
                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="min-h-[400px]">
                        {lesson.content_blocks && lesson.content_blocks
                            .sort((a: any, b: any) => a.order - b.order)
                            .map((block: any) => (
                                <ContentBlockRenderer key={block.id} block={block} />
                            ))
                        }
                    </div>

                    {/* Navigation Footer - Responsive */}
                    <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 md:gap-4">
                        {prevLesson ? (
                            <Link
                                href={`/learn/${courseId}/${prevLesson.id}`}
                                className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-lg md:rounded-xl border border-slate-200 text-slate-700 text-sm md:text-base font-bold hover:bg-slate-50 transition-all hover:shadow-sm touch-target"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                <span className="hidden sm:inline">Previous Lesson</span>
                                <span className="sm:hidden">Previous</span>
                            </Link>
                        ) : <div className="hidden sm:block"></div>}

                        {nextLesson ? (
                            <Link
                                href={`/learn/${courseId}/${nextLesson.id}`}
                                className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 rounded-lg md:rounded-xl bg-primary-600 text-white text-sm md:text-base font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5 touch-target"
                            >
                                <span className="hidden sm:inline">Next Lesson</span>
                                <span className="sm:hidden">Next</span>
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        ) : (
                            <button className="px-6 md:px-8 py-3 rounded-lg md:rounded-xl bg-green-600 text-white text-sm md:text-base font-bold opacity-50 cursor-not-allowed touch-target">
                                Course Completed
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
