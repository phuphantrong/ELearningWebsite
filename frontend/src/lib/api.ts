// Use environment variable for production, fallback to localhost for development
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function fetchCourses(page = 1, q = '') {
    const res = await fetch(`${API_URL}/courses?page=${page}&q=${q}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
}

export async function fetchCourseBySlug(slug: string) {
    const res = await fetch(`${API_URL}/courses/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}
export async function fetchCourse(id: string) {
    const res = await fetch(`${API_URL}/courses/id/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

export async function deleteCourse(id: string) {
    const res = await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete course');
    return res.json();
}

export async function updateCourse(id: string, data: any) {
    const res = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
}

// --- Sections ---
export async function createSection(courseId: string, title: string) {
    const res = await fetch(`${API_URL}/courses/${courseId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error('Failed to create section');
    return res.json();
}

export async function updateSection(id: string, data: any) {
    const res = await fetch(`${API_URL}/sections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update section');
    return res.json();
}

export async function deleteSection(id: string) {
    const res = await fetch(`${API_URL}/sections/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete section');
    return res.json();
}

export async function reorderSections(items: { id: string; order: number }[]) {
    const res = await fetch(`${API_URL}/sections/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
    });
    if (!res.ok) throw new Error('Failed to reorder sections');
    return res.json();
}

// --- Lessons ---
export async function fetchLesson(id: string) {
    const res = await fetch(`${API_URL}/lessons/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

export async function createLesson(sectionId: string, title: string, slug: string) {
    const res = await fetch(`${API_URL}/sections/${sectionId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug })
    });
    if (!res.ok) throw new Error('Failed to create lesson');
    return res.json();
}

export async function updateLesson(id: string, data: any) {
    const res = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update lesson');
    return res.json();
}

export async function deleteLesson(id: string) {
    const res = await fetch(`${API_URL}/lessons/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete lesson');
    return res.json();
}

export async function reorderLessons(items: { id: string; order: number }[]) {
    const res = await fetch(`${API_URL}/lessons/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
    });
    if (!res.ok) throw new Error('Failed to reorder lessons');
    return res.json();
}

// --- Content Blocks ---
export interface ContentBlock {
    id: string;
    type: 'TEXT' | 'CODE' | 'NOTE' | 'IMAGE' | 'HEADING' | 'LIST' | 'MATH' | 'CALLOUT';
    content: string;
    order: number;
    metadata?: any;
}


export async function createBlock(lessonId: string, type: string, content: string, order?: number, metadata?: any) {
    const res = await fetch(`${API_URL}/lessons/${lessonId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content, order, metadata })
    });
    if (!res.ok) throw new Error('Failed to create block');
    return res.json();
}

export async function updateBlock(id: string, data: any) {
    const res = await fetch(`${API_URL}/blocks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update block');
    return res.json();
}

export async function deleteBlock(id: string) {
    const res = await fetch(`${API_URL}/blocks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete block');
    return res.json();
}

export async function reorderBlocks(items: { id: string; order: number }[]) {
    const res = await fetch(`${API_URL}/blocks/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
    });
    if (!res.ok) throw new Error('Failed to reorder blocks');
    return res.json();
}
