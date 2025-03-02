"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownContent({ content }) {
    return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="rounded-md overflow-hidden my-2">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}