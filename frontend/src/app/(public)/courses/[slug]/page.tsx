
import Link from "next/link";

interface Lesson {
    id: string;
    title: string;
    slug: string;
    duration: number;
    is_free: boolean;
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
    description: string;
    price: number;
    slug: string;
    level: string;
    author_name: string;
    rating: number;
    rating_count: number;
    updated_at: string;
    sections: Section[];
}

async function getCourse(slug: string): Promise<Course | null> {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        const res = await fetch(`${API_URL}/courses/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        return {
            title: 'Course Not Found',
        };
    }

    return {
        title: `${course.title} | Online Learning Platform`,
        description: course.description,
        openGraph: {
            title: course.title,
            description: course.description,
            type: 'article',
        },
    };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        return <div className="p-20 text-center text-slate-500 text-xl font-medium">Course not found.</div>;
    }

    const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;
    const totalDuration = "12h 30m"; // Mocked for now

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16">
                <div className="container-custom">
                    <div className="text-sm text-slate-400 mb-4 flex gap-2">
                        <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                        <span>/</span>
                        <span className="text-white">Detail</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-4xl">{course.title}</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed">{course.description}</p>

                    <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">BEST SELLER</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 font-bold">{course.rating}</span>
                            <span className="text-yellow-400">{'★'.repeat(Math.round(course.rating))}</span>
                            <span>({course.rating_count} ratings)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Created by <span className="text-white underline decoration-dotted">{course.author_name}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Last updated {new Date(course.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🌐 English</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Main Content (66%) */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Tabs (Visual Only for Server Comp) */}
                        <div className="border-b border-slate-200 flex gap-8 text-sm font-bold text-slate-500">
                            <button className="pb-4 border-b-2 border-primary-600 text-primary-600">Overview</button>
                            <button className="pb-4 border-b-2 border-transparent hover:text-slate-800">Curriculum</button>
                            <button className="pb-4 border-b-2 border-transparent hover:text-slate-800">Instructor</button>
                            <button className="pb-4 border-b-2 border-transparent hover:text-slate-800">Reviews</button>
                        </div>

                        {/* What learn section */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-bold mb-6">What you'll learn</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Master the core concepts', 'Build real-world projects', 'Understand advanced patterns', 'Deploy to production'].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-slate-700">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Curriculum Accordion */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Course Content</h3>
                            <div className="text-sm text-slate-500 mb-4">{course.sections?.length} sections • {totalLessons} lessons • {totalDuration} total length</div>

                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white divide-y divide-slate-100">
                                {course.sections?.sort((a, b) => a.order - b.order).map((section, idx) => (
                                    <details key={section.id || idx} className="group" open={idx === 0}>
                                        <summary className="flex items-center justify-between p-5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors list-none select-none">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-400 transform group-open:rotate-180 transition-transform duration-200">
                                                    ▼
                                                </span>
                                                <span className="font-bold text-slate-800 text-lg">{section.title}</span>
                                            </div>
                                            <span className="text-sm text-slate-500">{section.lessons?.length} lectures</span>
                                        </summary>
                                        <div className="p-0">
                                            {section.lessons?.sort((a, b) => a.order - b.order || 0).map((lesson, lIdx) => (
                                                <Link
                                                    href={`/learn/${course.id}/${lesson.id}`}
                                                    key={lesson.id || lIdx}
                                                    className="flex items-center justify-between p-4 pl-12 hover:bg-slate-50 border-t border-slate-50 transition-colors group/lesson"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs text-slate-500 group-hover/lesson:bg-primary-600 group-hover/lesson:border-primary-600 group-hover/lesson:text-white transition-all">
                                                            ▶
                                                        </span>
                                                        <span className="text-slate-700 group-hover/lesson:text-primary-700 font-medium">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                                        {lesson.is_free && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Preview</span>}
                                                        <span>10:00</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar (33%) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white border border-slate-200 rounded-2xl p-2 shadow-lg overflow-hidden">
                            {/* Video Preview */}
                            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden mb-6 group cursor-pointer">
                                <img src="https://dummyimage.com/600x400/1e293b/ffffff&text=Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" alt="Preview" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toLocaleString()}`}
                                    </span>
                                    {Number(course.price) > 0 && <span className="text-lg text-slate-400 line-through mb-1">$999</span>}
                                </div>

                                <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-200 transition-all mb-4 transform hover:-translate-y-0.5">
                                    Enroll Now
                                </button>

                                <p className="text-center text-xs text-slate-500 mb-6">30-Day Money-Back Guarantee</p>

                                <div className="space-y-3">
                                    <h4 className="font-bold text-slate-900 mb-2">This course includes:</h4>
                                    {[
                                        `${totalDuration} on-demand video`,
                                        `${course.sections?.reduce((a, b) => a + (b.lessons?.length || 0), 0)} articles`,
                                        'Full lifetime access',
                                        'Access on mobile and TV',
                                        'Certificate of completion'
                                    ].map((feat, i) => (
                                        <div key={i} className="flex gap-3 text-sm text-slate-600">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                            {feat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
