
import Link from "next/link";
import { fetchLesson, fetchCourseBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import LessonClient from "./LessonClient";

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
        <LessonClient
            params={{ courseId, lessonId }}
            lessonData={lesson}
            courseData={{
                course,
                prevLesson,
                nextLesson,
                allLessons,
                progressPercentage
            }}
        />
    );
}
