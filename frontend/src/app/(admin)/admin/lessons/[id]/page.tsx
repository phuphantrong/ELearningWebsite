'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLesson, createBlock, updateBlock, deleteBlock, reorderBlocks, updateLesson, ContentBlock } from '@/lib/api';
import Link from 'next/link';
import MathRenderer from '@/components/MathRenderer';

// Helper to safely parse JSON for lists
const safeJsonParse = (str: string, fallback: any) => {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

interface Lesson {
    id: string;
    title: string;
    slug: string;
    section: {
        id: string;
        title: string;
        course: {
            id: string;
            title: string;
        }
    };
    content_blocks: ContentBlock[];
}

export default function LessonEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Block Editing State
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editMetadata, setEditMetadata] = useState<any>({});

    const loadLesson = async () => {
        try {
            const data = await fetchLesson(id);
            if (!data) {
                alert('Lesson not found');
                return;
            }
            // Ensure blocks are sorted
            const sortedBlocks = data.content_blocks?.sort((a: ContentBlock, b: ContentBlock) => a.order - b.order) || [];
            setLesson({ ...data, content_blocks: sortedBlocks });
        } catch (error) {
            console.error('Failed to load lesson', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLesson();
    }, [id]);

    const handleAddBlock = async (type: ContentBlock['type']) => {
        let content = '';
        let metadata = {};

        switch (type) {
            case 'TEXT': content = 'New text content'; break;
            case 'CODE': content = '// console.log("Hello")'; metadata = { language: 'javascript' }; break;
            case 'HEADING': content = 'New Heading'; metadata = { level: 2 }; break;
            case 'IMAGE': content = 'https://placehold.co/600x400'; metadata = { caption: 'Image caption', alt: 'Image description' }; break;
            case 'LIST': content = '["Item 1", "Item 2"]'; metadata = { style: 'unordered' }; break;
            case 'MATH': content = 'E = mc^2'; metadata = { display: 'block' }; break;
            case 'CALLOUT': content = 'Info message'; metadata = { variant: 'info' }; break;
            case 'NOTE': content = 'Note text'; break; // Legacy support
        }

        try {
            await createBlock(id, type, content, undefined, metadata);
            loadLesson();
        } catch (err) {
            alert('Failed to create block');
        }
    };

    const handleSaveBlock = async (blockId: string) => {
        try {
            await updateBlock(blockId, { content: editContent, metadata: editMetadata });
            setEditingBlockId(null);
            loadLesson();
        } catch (err) {
            alert('Failed to save block');
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        if (!confirm('Delete this block?')) return;
        try {
            await deleteBlock(blockId);
            loadLesson();
        } catch (err) {
            alert('Failed to delete block');
        }
    };

    const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
        if (!lesson) return;
        const blocks = [...lesson.content_blocks];

        if (direction === 'up' && index > 0) {
            [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
        } else if (direction === 'down' && index < blocks.length - 1) {
            [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
        } else {
            return;
        }

        // Optimistic UI
        setLesson({ ...lesson, content_blocks: blocks });

        const reorderItems = blocks.map((b, i) => ({ id: b.id, order: i + 1 }));
        try {
            await reorderBlocks(reorderItems);
        } catch (err) {
            loadLesson();
            console.error(err);
        }
    };

    const startEditing = (block: ContentBlock) => {
        setEditingBlockId(block.id);
        setEditContent(block.content);
        setEditMetadata(block.metadata || {});
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading lesson...</div>;
    if (!lesson) return null;

    return (
        <div className="max-w-4xl mx-auto pb-40">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/courses/${lesson.section?.course?.id}`} className="text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <div className="text-xs text-slate-500 mb-1">{lesson.section?.course.title} / {lesson.section?.title}</div>
                    <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                        onBlur={async () => {
                            try {
                                await updateLesson(lesson.id, { title: lesson.title, slug: lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
                            } catch (error) {
                                console.error('Failed to update lesson title', error);
                            }
                        }}
                        className="text-2xl font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-primary-500 rounded px-2 -ml-2 w-full focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Blocks List */}
            <div className="space-y-6 mb-12">
                {lesson.content_blocks.map((block, index) => (
                    <div key={block.id} className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-sm transition-all">
                        {/* Order Controls */}
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity border-r border-slate-100 bg-slate-50 rounded-l-xl">
                            <button onClick={() => handleMoveBlock(index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-slate-600 disabled:opacity-30">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <button onClick={() => handleMoveBlock(index, 'down')} disabled={index === lesson.content_blocks.length - 1} className="text-slate-400 hover:text-slate-600 disabled:opacity-30">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>

                        <div className="pl-8">
                            {editingBlockId === block.id ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded">
                                        <span className="px-2 py-1 bg-slate-200 rounded text-xs font-bold text-slate-700">{block.type}</span>

                                        {/* Metadata Inputs based on type */}
                                        {block.type === 'HEADING' && (
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500">Level:</label>
                                                <select
                                                    value={editMetadata.level || 2}
                                                    onChange={(e) => setEditMetadata({ ...editMetadata, level: Number(e.target.value) })}
                                                    className="text-xs border rounded p-1"
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>H{l}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {block.type === 'CODE' && (
                                            <select
                                                value={editMetadata.language || 'javascript'}
                                                onChange={(e) => setEditMetadata({ ...editMetadata, language: e.target.value })}
                                                className="text-xs border rounded p-1"
                                            >
                                                <option value="javascript">JavaScript</option>
                                                <option value="typescript">TypeScript</option>
                                                <option value="python">Python</option>
                                                <option value="html">HTML</option>
                                                <option value="css">CSS</option>
                                            </select>
                                        )}

                                        {block.type === 'LIST' && (
                                            <select
                                                value={editMetadata.style || 'unordered'}
                                                onChange={(e) => setEditMetadata({ ...editMetadata, style: e.target.value })}
                                                className="text-xs border rounded p-1"
                                            >
                                                <option value="unordered">Bullet List</option>
                                                <option value="ordered">Numbered List</option>
                                            </select>
                                        )}

                                        {block.type === 'CALLOUT' && (
                                            <select
                                                value={editMetadata.variant || 'info'}
                                                onChange={(e) => setEditMetadata({ ...editMetadata, variant: e.target.value })}
                                                className="text-xs border rounded p-1"
                                            >
                                                <option value="info">Info</option>
                                                <option value="warning">Warning</option>
                                                <option value="success">Success</option>
                                                <option value="danger">Danger</option>
                                            </select>
                                        )}
                                    </div>

                                    {/* Content Key Inputs */}
                                    {block.type === 'IMAGE' ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full p-2 rounded border"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Caption"
                                                    value={editMetadata.caption || ''}
                                                    onChange={(e) => setEditMetadata({ ...editMetadata, caption: e.target.value })}
                                                    className="w-full p-2 rounded border text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Alt Text"
                                                    value={editMetadata.alt || ''}
                                                    onChange={(e) => setEditMetadata({ ...editMetadata, alt: e.target.value })}
                                                    className="w-full p-2 rounded border text-sm"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={block.type === 'CODE' ? 8 : 4}
                                            className={`w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm ${block.type === 'CODE' ? 'bg-slate-900 text-slate-100' : 'bg-white border-slate-300'}`}
                                            placeholder="Enter block content..."
                                        />
                                    )}

                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingBlockId(null)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                                        <button onClick={() => handleSaveBlock(block.id)} className="px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <div onClick={() => startEditing(block)} className="cursor-pointer">
                                    {/* HEADING Render */}
                                    {block.type === 'HEADING' && (
                                        (() => {
                                            const Tag = `h${Math.min(Math.max(block.metadata?.level || 2, 1), 6)}` as React.ElementType;
                                            return <Tag className="font-bold text-slate-900">{block.content}</Tag>
                                        })()
                                    )}

                                    {/* TEXT Render */}
                                    {block.type === 'TEXT' && (
                                        <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">{block.content}</div>
                                    )}

                                    {/* CODE Render */}
                                    {block.type === 'CODE' && (
                                        <div className="relative">
                                            <div className="absolute top-2 right-2 text-xs text-slate-500 font-mono">{block.metadata?.language || (block as any).extra?.language}</div>
                                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">{block.content}</pre>
                                        </div>
                                    )}

                                    {/* IMAGE Render */}
                                    {block.type === 'IMAGE' && (
                                        <div className="flex flex-col items-center">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={block.content} alt={block.metadata?.alt || 'Image'} className="max-w-full h-auto rounded-lg shadow-sm" />
                                            {block.metadata?.caption && <span className="text-sm text-slate-500 mt-2 italic">{block.metadata.caption}</span>}
                                        </div>
                                    )}

                                    {/* LIST Render */}
                                    {block.type === 'LIST' && (
                                        (() => {
                                            const items = safeJsonParse(block.content, []);
                                            const ListTag = block.metadata?.style === 'ordered' ? 'ol' : 'ul';
                                            return (
                                                <ListTag className={`pl-5 ${block.metadata?.style === 'ordered' ? 'list-decimal' : 'list-disc'} space-y-1`}>
                                                    {Array.isArray(items) ? items.map((item: string, i: number) => (
                                                        <li key={i}>{item}</li>
                                                    )) : <li>Invalid List JSON</li>}
                                                </ListTag>
                                            );
                                        })()
                                    )}

                                    {/* CALLOUT / NOTE Render */}
                                    {(block.type === 'CALLOUT' || block.type === 'NOTE') && (
                                        <div className={`p-4 rounded-lg border-l-4 ${block.metadata?.variant === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-900' :
                                            block.metadata?.variant === 'success' ? 'bg-green-50 border-green-500 text-green-900' :
                                                block.metadata?.variant === 'danger' ? 'bg-red-50 border-red-500 text-red-900' :
                                                    'bg-blue-50 border-blue-500 text-blue-900'
                                            }`}>
                                            {block.content}
                                        </div>
                                    )}

                                    {/* MATH Render */}
                                    {block.type === 'MATH' && (
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                            <MathRenderer
                                                latex={block.content.replace(/^\$\$\s*/, '').replace(/\s*\$\$$/, '').trim()}
                                                displayMode={block.metadata?.display === 'block'}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditing(block)} className="p-1.5 text-slate-400 hover:text-primary-600 bg-white shadow-sm border border-slate-200 rounded">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleDeleteBlock(block.id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-white shadow-sm border border-slate-200 rounded">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {lesson.content_blocks.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-400 mb-4">No content blocks yet</p>
                    </div>
                )}
            </div>

            {/* Sticky Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl px-4 py-2 rounded-2xl flex items-center gap-1 overflow-x-auto max-w-[90vw]">
                <ToolbarButton icon="T" label="Text" onClick={() => handleAddBlock('TEXT')} />
                <ToolbarButton icon="H" label="Heading" onClick={() => handleAddBlock('HEADING')} />
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <ToolbarButton icon="{ }" label="Code" onClick={() => handleAddBlock('CODE')} />
                <ToolbarButton icon="🖼️" label="Image" onClick={() => handleAddBlock('IMAGE')} />
                <ToolbarButton icon="📝" label="List" onClick={() => handleAddBlock('LIST')} />
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <ToolbarButton icon="ℹ️" label="Callout" onClick={() => handleAddBlock('CALLOUT')} />
                <ToolbarButton icon="Σ" label="Math" onClick={() => handleAddBlock('MATH')} />
            </div>
        </div>
    );
}

function ToolbarButton({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 font-medium whitespace-nowrap">
            <span className="font-bold text-slate-500">{icon}</span>
            <span>{label}</span>
        </button>
    );
}
