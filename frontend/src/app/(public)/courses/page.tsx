
import Link from "next/link";
import { fetchCourses } from "@/lib/api";

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
    const { q = '', page = '1' } = await searchParams;
    const { data: courses, meta } = await fetchCourses(Number(page), q);

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="container-custom">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Explore Courses</h1>
                        <p className="text-slate-500 mt-2">Discover new skills and advance your career.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex w-full md:w-auto gap-3">
                        <form className="relative w-full md:w-80">
                            <input
                                name="q"
                                defaultValue={q}
                                placeholder="Search courses..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                        <select className="px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 shadow-sm cursor-pointer">
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {courses.map((course: any) => (
                        <Link href={`/courses/${course.slug}`} key={course.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100 h-full">
                            {/* Card Image */}
                            <div className="relative aspect-video bg-slate-200 overflow-hidden">
                                <img
                                    src={course.author_avatar || `https://dummyimage.com/600x400/6366f1/ffffff&text=${encodeURIComponent(course.title.substring(0, 10))}`}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Badges */}
                                {course.level && (
                                    <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded shadow-md ${course.level === 'Beginner' ? 'bg-green-500' :
                                            course.level === 'Intermediate' ? 'bg-blue-500' : 'bg-purple-500'
                                        }`}>
                                        {course.level}
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
                                        {/* Avatar placeholder if no image */}
                                        {course.author_name.charAt(0)}
                                    </div>
                                    <span>{course.author_name}</span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-4">
                                    <span className="text-yellow-400 font-bold text-sm">{course.rating || 0}</span>
                                    <div className="flex text-yellow-400 text-xs">
                                        {'★'.repeat(Math.round(course.rating || 0))}
                                        <span className="text-slate-300">{'★'.repeat(5 - Math.round(course.rating || 0))}</span>
                                    </div>
                                    <span className="text-slate-400 text-xs">({course.rating_count || 0})</span>
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-slate-900">
                                            {Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toLocaleString()}`}
                                        </span>
                                    </div>
                                    <span className="text-primary-600 bg-primary-50 px-3 py-1 rounded-full text-xs font-semibold group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                        Details →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {courses.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        No courses found matching "{q}".
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-2">
                    {meta.page > 1 && (
                        <Link
                            href={`/courses?page=${meta.page - 1}&q=${q}`}
                            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                        >
                            Previous
                        </Link>
                    )}
                    <span className="px-4 py-2 text-slate-500">
                        Page {meta.page} of {meta.last_page}
                    </span>
                    {meta.page < meta.last_page && (
                        <Link
                            href={`/courses?page=${meta.page + 1}&q=${q}`}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-sm transition-colors"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
