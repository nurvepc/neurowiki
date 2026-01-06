import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-a:text-neuro-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:list-disc prose-ol:list-decimal">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
