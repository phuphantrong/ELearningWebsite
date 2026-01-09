'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MathRenderer from './MathRenderer';

// Helper to safely parse JSON
const safeJsonParse = (str: string, fallback: any) => {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

// Simple Markdown to HTML converter
const parseMarkdown = (text: string) => {
    let html = text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\(i\)/gim, '<em>i</em>')
        .replace(/\n/gim, '<br />');

    return html;
};

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors z-10"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    // Handle YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&?]+)/);
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Handle Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
};

export default function ContentBlockRenderer({ block }: { block: any }) {
    const blockType = block.type?.toUpperCase();

    switch (blockType) {
        case 'HEADING':
            const headingLevel = Math.min(Math.max(block.metadata?.level || 2, 1), 6);
            const HeadingTag = `h${headingLevel}` as React.ElementType;
            const headingClasses = {
                1: 'text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mt-8 md:mt-12 mb-4 md:mb-6',
                2: 'text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mt-6 md:mt-10 mb-3 md:mb-5',
                3: 'text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mt-5 md:mt-8 mb-3 md:mb-4',
                4: 'text-base md:text-lg lg:text-xl font-bold text-slate-800 mt-4 md:mt-6 mb-2 md:mb-3',
                5: 'text-sm md:text-base lg:text-lg font-bold text-slate-700 mt-3 md:mt-5 mb-2',
                6: 'text-sm md:text-base font-bold text-slate-700 mt-3 md:mt-4 mb-2',
            }[headingLevel] || 'text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mt-5 md:mt-8 mb-3 md:mb-4';

            return <HeadingTag className={headingClasses}>{block.content}</HeadingTag>;

        case 'TEXT':
            return (
                <div className="prose prose-slate prose-sm md:prose-base max-w-none mb-6 md:mb-8 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: parseMarkdown(block.content) }} />
                </div>
            );

        case 'CODE':
            const language = block.metadata?.language || 'javascript';
            return (
                <div className="relative mb-6 md:mb-8 rounded-lg md:rounded-xl overflow-hidden shadow-lg bg-[#1e1e1e] border border-slate-700 code-block-responsive">
                    <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-[#252526] border-b border-slate-700">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{language}</span>
                    </div>
                    <CopyButton text={block.content} />
                    <div className="overflow-x-auto">
                        <SyntaxHighlighter
                            language={language}
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', lineHeight: '1.5' }}
                            wrapLines={false}
                            wrapLongLines={false}
                        >
                            {block.content}
                        </SyntaxHighlighter>
                    </div>
                </div>
            );

        case 'LIST':
            const items = safeJsonParse(block.content, []);
            const isOrdered = block.metadata?.style === 'ordered';
            const ListTag = isOrdered ? 'ol' : 'ul';
            return (
                <div className="mb-8">
                    <ListTag className={`space-y-2 ${isOrdered ? 'list-decimal' : 'list-disc'} list-inside text-slate-700 leading-relaxed`}>
                        {Array.isArray(items) ? items.map((item: string, i: number) => (
                            <li key={i} className="pl-2">{item}</li>
                        )) : <li className="text-red-500">Invalid list format</li>}
                    </ListTag>
                </div>
            );

        case 'CALLOUT':
        case 'NOTE':
            const variant = (block.metadata?.variant || 'info') as 'info' | 'warning' | 'success' | 'danger';
            const variantStyles: Record<string, string> = {
                info: 'bg-blue-50 border-blue-500 text-blue-900',
                warning: 'bg-amber-50 border-amber-500 text-amber-900',
                success: 'bg-green-50 border-green-500 text-green-900',
                danger: 'bg-red-50 border-red-500 text-red-900',
            };

            const icons: Record<string, React.ReactElement> = {
                info: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                warning: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
                success: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                danger: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            };

            return (
                <div className={`mb-8 p-6 rounded-xl border-l-4 shadow-sm ${variantStyles[variant]}`}>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>
                        <p className="opacity-90 leading-relaxed flex-1">{block.content}</p>
                    </div>
                </div>
            );

        case 'MATH':
            // Strip $$ delimiters if they exist (for backward compatibility)
            const cleanLatex = block.content.replace(/^\$\$\s*/, '').replace(/\s*\$\$$/, '').trim();
            const isBlockMath = block.metadata?.display === 'block';

            return (
                <div className={`mb-8 ${isBlockMath ? 'flex justify-center' : 'inline-block'}`}>
                    <MathRenderer
                        latex={cleanLatex}
                        displayMode={isBlockMath}
                        className={isBlockMath ? 'text-lg' : 'text-base'}
                    />
                </div>
            );

        case 'IMAGE':
            return (
                <div className="mb-6 md:mb-8 flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={block.content}
                        alt={block.metadata?.alt || 'Content'}
                        className="rounded-lg md:rounded-xl shadow-lg border border-slate-200 w-full max-h-[300px] md:max-h-[400px] lg:max-h-[500px] object-contain"
                        loading="lazy"
                    />
                    {block.metadata?.caption && (
                        <p className="text-xs md:text-sm text-slate-500 mt-2 md:mt-3 italic text-center px-2">{block.metadata.caption}</p>
                    )}
                </div>
            );

        case 'VIDEO':
            const embedUrl = getVideoEmbedUrl(block.content);
            return (
                <div className="mb-6 md:mb-8 w-full">
                    <div className="aspect-video rounded-lg md:rounded-xl overflow-hidden shadow-lg bg-black">
                        <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder="0"
                        />
                    </div>
                </div>
            )

        default:
            return <div className="text-red-500 italic mb-4">Unknown Block Type: {block.type}</div>;
    }
}
