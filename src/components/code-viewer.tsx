"use client"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface CodeViewerProps {
    code: string;
    language: string;
}

export function CodeViewer({ code, language }: CodeViewerProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <pre className="p-4 rounded-md bg-muted overflow-auto">
                <code>{code}</code>
            </pre>
        );
    }

    return (
        <SyntaxHighlighter
            language={language || 'text'}
            style={theme === 'dark' ? vscDarkPlus : vs}
            customStyle={{ margin: 0, borderRadius: '0.5rem', fontSize: '0.875rem' }}
            showLineNumbers
        >
            {code}
        </SyntaxHighlighter>
    );
}
