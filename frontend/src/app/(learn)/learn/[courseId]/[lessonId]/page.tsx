
import Link from "next/link";
import { fetchLesson, fetchCourseBySlug } from "@/lib/api";
import ContentBlockRenderer from "@/components/ContentBlockRenderer";
import { notFound } from "next/navigation";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
    const { courseId, lessonId } = await params;
    const lesson = await fetchLesson(lessonId);

    if (!lesson) notFound();

    // Fetch full course for navigation
    const courseSlug = lesson.section?.course?.slug;
    let course = null;
    let prevLesson = null;
    let nextLesson = null;
    let allLessons: any[] = [];
    let progressPercentage = 0;

    if (courseSlug) {
        course = await fetchCourseBySlug(courseSlug);
        if (course && course.sections) {
            const sortedSections = course.sections.sort((a: any, b: any) => a.order - b.order);
            allLessons = sortedSections.flatMap((sec: any) =>
                (sec.lessons || [])
                    .sort((l1: any, l2: any) => l1.order - l2.order)
                    .map((l: any) => ({ ...l, sectionTitle: sec.title }))
            );

            const currentIndex = allLessons.findIndex((l: any) => l.id === lesson.id);
            if (currentIndex !== -1) {
                prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
                nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
                progressPercentage = Math.round(((currentIndex) / allLessons.length) * 100);
            }
        }
    }

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden">
            {/* Left Sidebar (Navigation) */}
            <aside className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0 h-full">
                <div className="p-5 border-b border-slate-200 bg-white">
                    <Link href={`/courses/${course?.slug}`} className="text-sm font-medium text-slate-500 hover:text-primary-600 mb-2 block">
                        ← Back to Course info
                    </Link>
                    <h2 className="font-bold text-slate-900 leading-tight">{course?.title}</h2>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>{progressPercentage}% Completed</span>
                            <span>{allLessons.length} lessons</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {course?.sections?.sort((a: any, b: any) => a.order - b.order).map((section: any) => (
                        <div key={section.id}>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.lessons?.sort((a: any, b: any) => a.order - b.order).map((l: any) => {
                                    const isActive = l.id === lesson.id;
                                    return (
                                        <Link
                                            key={l.id}
                                            href={`/learn/${courseId}/${l.id}`}
                                            className={`
                                                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                                ${isActive
                                                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                                }
                                            `}
                                        >
                                            {isActive ? (
                                                <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 group-hover:border-slate-400"></div>
                                                // If completed, use checkmark:
                                                // <svg className="w-5 h-5 text-green-500" fill="none" ... d="M5 13l4 4L19 7" />
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
                <div className="max-w-4xl mx-auto px-8 py-12">
                    {/* Header */}
                    <div className="mb-8 pb-8 border-b border-slate-100">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">{lesson.title}</h1>
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

                    {/* Navigation Footer */}
                    <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center gap-4">
                        {prevLesson ? (
                            <Link
                                href={`/learn/${courseId}/${prevLesson.id}`}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all hover:shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                Previous Lesson
                            </Link>
                        ) : <div></div>}

                        {nextLesson ? (
                            <Link
                                href={`/learn/${courseId}/${nextLesson.id}`}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Next Lesson
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        ) : (
                            <button className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold opacity-50 cursor-not-allowed">
                                Course Completed
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
