import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Library, ArrowLeft, ArrowUp, List, ChevronDown, ExternalLink } from 'lucide-react';
import { GUIDE_CONTENT } from '../data/guideContent';

const generateSlug = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

const ResidentGuide: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const categories = Array.from(new Set(Object.values(GUIDE_CONTENT).map(t => t.category)));
  const currentTopic = topicId ? GUIDE_CONTENT[topicId] : null;

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Use window scroll since we are relying on Layout's scroll or Main window scroll
  // Note: Layout has overflow-y-auto on main, so we listen to that if possible, 
  // but simpler to rely on the fact that sticky works within the scrolling container.
  // For the 'Scroll To Top' button visibility, we can try to attach to the main layout scroller or just show it always when deep down.
  // Since we can't easily access the Layout ref here, we will use a simple efficient check if possible, 
  // or just rely on the layout structure. 
  // Actually, let's attach the listener to the closest scrollable ancestor (Layout's main) via classic DOM query for simplicity.
  useEffect(() => {
    const mainScroller = document.querySelector('main');
    const handleScroll = () => {
      if (mainScroller) {
        setShowScrollTop(mainScroller.scrollTop > 300);
      }
    };
    
    if (mainScroller) {
      mainScroller.addEventListener('scroll', handleScroll);
    }
    return () => mainScroller?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const mainScroller = document.querySelector('main');
    mainScroller?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Extract headings for Table of Contents (Desktop)
  const headings = useMemo(() => {
    return currentTopic
    ? currentTopic.content.match(/^##\s+(.+)$/gm)?.map((h) => {
        const text = h.replace(/^##\s+/, '');
        const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        return { text: cleanText, id: generateSlug(cleanText) };
      }) || []
    : [];
  }, [currentTopic]);

  // Parse content into sections for Mobile Accordion
  const sections = useMemo(() => {
    if (!currentTopic) return [];
    const lines = currentTopic.content.split('\n');
    const result: { title: string; content: string; id: string }[] = [];
    let currentTitle = "Overview";
    let currentContent: string[] = [];

    const cleanTitle = (t: string) => {
        return t
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/`/g, '');
    };

    if (lines[0]?.startsWith('## ')) {
        currentTitle = lines[0].replace('## ', '').trim();
    }

    lines.forEach((line, index) => {
      if (index === 0 && line.startsWith('## ')) return;

      if (line.startsWith('## ')) {
        if (currentContent.length > 0 || (currentTitle !== "Overview" && result.length === 0)) {
           result.push({
             title: cleanTitle(currentTitle),
             content: currentContent.join('\n'),
             id: generateSlug(cleanTitle(currentTitle))
           });
        }
        currentTitle = line.replace('## ', '').trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    });
    
    if (currentContent.length > 0 || currentTitle !== "Overview") {
        result.push({
            title: cleanTitle(currentTitle),
            content: currentContent.join('\n'),
            id: generateSlug(cleanTitle(currentTitle))
        });
    }
    
    return result.filter(s => s.title !== "Overview" || s.content.trim().length > 0);
  }, [currentTopic]);

  // Premium Custom Markdown Components
  const markdownComponents = {
    h1: ({children, ...props}: any) => (
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6" {...props}>{children}</h1>
    ),
    h2: ({children, ...props}: any) => {
        const rawText = children?.toString() || '';
        const id = generateSlug(rawText);
        return (
            <h2 id={id} className="group flex items-center text-xl font-bold text-slate-900 mt-12 mb-6 scroll-mt-24 pb-3 border-b border-gray-100" {...props}>
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neuro-50 text-neuro-600 mr-3 group-hover:bg-neuro-100 transition-colors shadow-sm ring-1 ring-neuro-100">
                    <ChevronRight size={18} strokeWidth={3} />
                </span>
                {children}
            </h2>
        );
    },
    h3: ({children, ...props}: any) => (
        <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4 flex items-center" {...props}>
             <span className="w-1.5 h-1.5 bg-neuro-300 rounded-full mr-3"></span>
             {children}
        </h3>
    ),
    p: ({children, ...props}: any) => (
        <p className="text-slate-600 leading-8 mb-6 font-normal text-base" {...props}>{children}</p>
    ),
    ul: ({children, ...props}: any) => (
        <ul className="space-y-4 mb-8" {...props}>{children}</ul>
    ),
    ol: ({children, ...props}: any) => (
        <ol className="space-y-4 mb-8 list-decimal list-inside text-slate-600 leading-relaxed" {...props}>{children}</ol>
    ),
    li: ({children, ...props}: any) => (
        <li className="flex items-start text-slate-600 leading-7" {...props}>
             <div className="mt-2.5 mr-3 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-neuro-400"></div>
             </div>
             <div className="flex-1">{children}</div>
        </li>
    ),
    strong: ({children, ...props}: any) => (
        <strong className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded mx-0.5 border border-slate-200 text-sm" {...props}>{children}</strong>
    ),
    blockquote: ({children, ...props}: any) => (
        <blockquote className="border-l-4 border-neuro-500 bg-neuro-50 p-6 rounded-r-xl italic text-neuro-900 my-8 shadow-sm" {...props}>
            {children}
        </blockquote>
    ),
    table: ({children, ...props}: any) => (
        <div className="overflow-x-auto my-10 rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white" {...props}>{children}</table>
        </div>
    ),
    thead: ({children, ...props}: any) => (
        <thead className="bg-gray-50 text-slate-700" {...props}>{children}</thead>
    ),
    th: ({children, ...props}: any) => (
        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" {...props}>{children}</th>
    ),
    tbody: ({children, ...props}: any) => (
        <tbody className="divide-y divide-gray-100 bg-white" {...props}>{children}</tbody>
    ),
    tr: ({children, ...props}: any) => (
        <tr className="hover:bg-gray-50 transition-colors" {...props}>{children}</tr>
    ),
    td: ({children, ...props}: any) => (
        <td className="px-6 py-4 whitespace-normal text-sm text-slate-600 leading-relaxed" {...props}>{children}</td>
    ),
    a: ({node, href, children, ...props}: any) => {
        if (href?.startsWith('/')) {
            return <Link to={href} className="text-neuro-600 font-semibold hover:text-neuro-800 underline decoration-neuro-200 hover:decoration-neuro-500 underline-offset-4 transition-all" {...props}>{children}</Link>;
        }
        return (
            <a href={href} className="inline-flex items-center text-neuro-600 font-semibold hover:text-neuro-800 underline decoration-neuro-200 hover:decoration-neuro-500 underline-offset-4 transition-all" {...props}>
                {children} <ExternalLink size={12} className="ml-1 opacity-50" />
            </a>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row relative items-start">
      {/* Sidebar Guide Nav - Sticky on Desktop */}
      {!topicId && (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 md:sticky md:top-0 md:h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar self-start">
          <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/95">
             <h2 className="font-bold text-slate-900 flex items-center text-lg">
               <Library className="mr-2 text-neuro-600" size={24} /> Resident Guide
             </h2>
             <p className="text-xs text-slate-500 mt-1 ml-8">Clinical protocols & references</p>
          </div>
          <div className="p-4 space-y-8">
            {categories.map(cat => (
              <div key={cat}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">{cat}</h3>
                <div className="space-y-1">
                  {Object.values(GUIDE_CONTENT)
                    .filter(t => t.category === cat)
                    .map(topic => (
                      <Link
                        key={topic.id}
                        to={`/guide/${topic.id}`}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          topicId === topic.id 
                            ? 'bg-neuro-50 text-neuro-700 font-semibold shadow-sm ring-1 ring-neuro-100' 
                            : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{topic.title}</span>
                        {topicId === topic.id && <ChevronRight size={14} className="text-neuro-500" />}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Area - Relies on Main Layout Scroll */}
      <div className="flex-1 min-w-0">
        {currentTopic ? (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Link 
              to="/guide"
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-neuro-600 mb-6 transition-colors group"
             >
                <div className="bg-white p-1.5 rounded-md border border-gray-200 mr-2 shadow-sm group-hover:border-neuro-200 group-hover:shadow-md transition-all">
                    <ArrowLeft size={16} />
                </div>
                Back to Guide Index
             </Link>

            {/* DESKTOP VIEW: Full Prose + Sticky TOC */}
            <div className="hidden lg:grid grid-cols-12 gap-10 items-start">
                {/* Main Content */}
                <div className="col-span-9">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 min-h-[500px]">
                      <div className="mb-10 border-b border-gray-100 pb-10">
                         <div className="flex items-center space-x-2 mb-4">
                             <span className="px-3 py-1 rounded-full bg-neuro-50 text-neuro-700 text-xs font-bold tracking-wide uppercase border border-neuro-100">
                               {currentTopic.category}
                             </span>
                         </div>
                         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{currentTopic.title}</h1>
                      </div>

                      {/* Content Render */}
                      <div className="content-wrapper">
                        <ReactMarkdown components={markdownComponents}>
                            {currentTopic.content}
                        </ReactMarkdown>
                      </div>
                  </div>
                  
                  {/* Feedback / Footer for article */}
                  <div className="mt-8 text-center text-sm text-slate-400">
                    <p>Last updated 2024 • Clinical Reference Only</p>
                  </div>
                </div>

                {/* Sticky Table of Contents Sidebar */}
                <div className="col-span-3 sticky top-6 self-start">
                    {headings.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-neuro-100">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/80 backdrop-blur-sm">
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                                    <List size={14} className="mr-2 text-neuro-600" />
                                    Table of Contents
                                </h3>
                            </div>
                            <nav className="max-h-[70vh] overflow-y-auto p-2 custom-scrollbar">
                                {headings.map((heading, index) => (
                                    <button
                                        key={index}
                                        onClick={() => scrollToSection(heading.id)}
                                        className="text-left w-full text-sm text-slate-600 hover:text-neuro-700 hover:bg-neuro-50 px-3 py-2.5 rounded-lg transition-all border-l-2 border-transparent hover:border-neuro-500 group flex items-start"
                                    >
                                        <span className="mt-1.5 mr-2 w-1.5 h-1.5 rounded-full bg-neuro-200 group-hover:bg-neuro-500 transition-colors flex-shrink-0"></span>
                                        <span className="truncate leading-tight">{heading.text}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE VIEW: Accordion Style */}
            <div className="lg:hidden space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                     <span className="text-xs font-bold text-neuro-600 uppercase tracking-wide bg-neuro-50 px-2 py-1 rounded border border-neuro-100">
                       {currentTopic.category}
                     </span>
                     <h1 className="text-2xl font-extrabold text-slate-900 mt-3 leading-tight">{currentTopic.title}</h1>
                </div>

                <div className="space-y-3">
                    {sections.map((section) => (
                        <details key={section.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden open:ring-2 open:ring-neuro-100 open:border-neuro-300 transition-all duration-300">
                            <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors list-none select-none">
                                <span className="font-bold text-slate-800 text-lg flex items-center">
                                    <span className="w-1.5 h-6 bg-neuro-500 rounded-full mr-3 group-open:bg-neuro-600 transition-colors"></span>
                                    {section.title}
                                </span>
                                <span className="transition-transform duration-300 group-open:rotate-180 text-slate-400 group-open:text-neuro-500">
                                    <ChevronDown size={20} />
                                </span>
                            </summary>
                            <div className="p-5 pt-0 border-t border-gray-100">
                                <div className="mt-4">
                                    <ReactMarkdown components={markdownComponents}>
                                        {section.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 bg-neuro-600 text-white p-3 rounded-full shadow-xl hover:bg-neuro-700 hover:scale-110 transition-all duration-300 transform z-50 ${
                    showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                }`}
                aria-label="Scroll to Top"
            >
                <ArrowUp size={24} />
            </button>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500 min-h-[600px]">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 max-w-md relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-tr from-neuro-50 to-transparent opacity-50"></div>
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-neuro-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neuro-600 group-hover:scale-110 transition-transform duration-300 border border-neuro-100">
                        <Library size={48} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Neurology Resident Guide</h1>
                    <p className="text-slate-500 leading-relaxed">
                    Select a topic from the sidebar to view clinical protocols, scoring systems, and admission orders.
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentGuide;