"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function MarkdownContent({ content }) {
    return (
        <div className="text-gray-800 dark:text-gray-200">
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // Handle inline code specially
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            // Code block (not inline)
                            <div className="rounded-md overflow-hidden my-2 border border-gray-200 dark:border-gray-700">
                                <pre className="p-0 m-0 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            // Inline code
                            <code
                                className={`${className || ''} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700`}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    // Basic text elements
                    p({ children }) {
                        return <p className="text-gray-700 dark:text-gray-300 mb-4">{children}</p>;
                    },
                    strong({ children }) {
                        return <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>;
                    },
                    em({ children }) {
                        return <em className="text-gray-800 dark:text-gray-200 italic">{children}</em>;
                    },
                    // Headings
                    h1({ children }) {
                        return <h1 className="text-gray-900 dark:text-gray-100 text-2xl font-bold mt-6 mb-4">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold mt-5 mb-3">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold mt-4 mb-2">{children}</h3>;
                    },
                    // Lists
                    ul({ children }) {
                        return <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300">{children}</ol>;
                    },
                    li({ children }) {
                        return <li className="mb-1 text-gray-700 dark:text-gray-300">{children}</li>;
                    },
                    // Other elements
                    blockquote({ children }) {
                        return <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400 my-4">{children}</blockquote>;
                    },
                    a({ href, children }) {
                        return <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}