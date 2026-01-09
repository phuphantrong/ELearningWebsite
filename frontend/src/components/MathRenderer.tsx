'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
    latex: string;
    displayMode?: boolean; // true = block, false = inline
    className?: string;
}

/**
 * MathRenderer Component
 * 
 * Renders LaTeX math formulas using KaTeX
 * 
 * @param latex - Pure LaTeX string (NO delimiters like $$ or $)
 * @param displayMode - true for block-level (centered), false for inline
 * @param className - Additional CSS classes
 * 
 * @example
 * // Block math (centered, larger)
 * <MathRenderer latex="E = mc^2" displayMode={true} />
 * 
 * // Inline math (flows with text)
 * <MathRenderer latex="x^2 + y^2 = r^2" displayMode={false} />
 */
export default function MathRenderer({ latex, displayMode = true, className = '' }: MathRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !latex) return;

        try {
            // Clear previous content
            containerRef.current.innerHTML = '';

            // Render with KaTeX
            katex.render(latex, containerRef.current, {
                displayMode,
                throwOnError: false, // Don't crash on invalid LaTeX
                errorColor: '#cc0000',
                strict: false,
                trust: false,
                macros: {
                    // Common macros for teaching math
                    "\\RR": "\\mathbb{R}",
                    "\\NN": "\\mathbb{N}",
                    "\\ZZ": "\\mathbb{Z}",
                    "\\QQ": "\\mathbb{Q}",
                    "\\CC": "\\mathbb{C}",
                }
            });
        } catch (error) {
            // Fallback: display raw LaTeX on error
            if (containerRef.current) {
                containerRef.current.textContent = `Error rendering: ${latex}`;
                containerRef.current.style.color = '#cc0000';
            }
            console.error('KaTeX rendering error:', error);
        }
    }, [latex, displayMode]);

    return (
        <div
            ref={containerRef}
            className={`katex-renderer ${displayMode ? 'katex-display' : 'katex-inline'} ${className}`}
        />
    );
}
