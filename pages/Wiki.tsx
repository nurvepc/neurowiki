
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GUIDE_CONTENT } from '../data/guideContent';
import { ArrowLeft, BookOpen, Search, ChevronRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { askQuickAnswer } from '../services/gemini';
import MarkdownRenderer from '../components/MarkdownRenderer';

const Wiki: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const query = topic?.toLowerCase() || '';

  const results = Object.values(GUIDE_CONTENT).filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.content.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Reset AI state when topic changes
  useEffect(() => {
    setAiAnswer(null);
    setLoading(false);
    setError(false);
  }, [topic]);

  const handleAskAI = async () => {
    if (!topic) return;
    setLoading(true);
    setError(false);
    try {
      const answer = await askQuickAnswer(topic);
      setAiAnswer(answer);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate a clean, text-only summary of the clinical content
  const getCleanSummary = (content: string) => {
    return content
      .replace(/##\s+/g, '') // Remove headers
      .replace(/\*/g, '')    // Remove bold/italics
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Clean links
      .replace(/\n+/g, ' ')  // Flatten to one line
      .trim()
      .substring(0, 140) + '...';
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Header */}
      <div className="mb-8 md:mb-12 px-2">
        <Link 
          to="/" 
          className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-neuro-600 transition-all group mb-6"
        >
            <div className="bg-white p-1.5 rounded-lg border border-gray-100 mr-3 shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            </div>
            Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Search Results for <span className="text-neuro-600">"{topic}"</span>
        </h1>
        <p className="text-slate-500 mt-4 font-medium text-base md:text-lg">
          Found <span className="text-slate-900 font-bold">{results.length}</span> matching articles in the catalogue.
        </p>
      </div>

      {/* AI Search Card */}
      <div className="mb-10 px-2">
        {!aiAnswer && !loading && (
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                   <Sparkles size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Ask NeuroWiki AI</h3>
                   <p className="text-sm text-slate-600">Generate a clinical summary for "{topic}" using Gemini 2.0.</p>
                </div>
             </div>
             <button 
               onClick={handleAskAI}
               className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center active:scale-95"
             >
                <Sparkles size={16} className="mr-2" /> Generate Answer
             </button>
          </div>
        )}

        {loading && (
           <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
              <Loader2 size={32} className="text-indigo-600 animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-500 animate-pulse">Generating clinical summary...</p>
           </div>
        )}

        {aiAnswer && (
           <div className="bg-white border border-indigo-100 p-8 rounded-2xl shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="flex items-center space-x-2 mb-6 text-indigo-700">
                 <Sparkles size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">AI Generated Response</span>
              </div>
              <div className="prose prose-indigo prose-sm max-w-none">
                 <MarkdownRenderer content={aiAnswer} />
              </div>
              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center text-[10px] text-slate-400 font-medium">
                 <AlertCircle size={12} className="mr-1.5" />
                 AI content can be inaccurate. Always verify with clinical guidelines.
              </div>
           </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {results.map((result) => (
            <Link 
              key={result.id} 
              to={result.category === 'Neuro Trials' ? `/trials/${result.id}` : `/guide/${result.id}`} 
              className="block bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-neuro-100 hover:-translate-y-1 active:scale-[0.98] transition-all group relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neuro-50 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity -mr-16 -mt-16"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                      result.category === 'Neuro Trials' 
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-100/50' 
                        : 'text-neuro-600 bg-neuro-50 border-neuro-100/50'
                    }`}>
                      {result.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-neuro-700 transition-colors leading-snug">
                    {result.title}
                  </h2>
                  
                  <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed font-medium line-clamp-2">
                    {getCleanSummary(result.content)}
                  </p>
                  
                  <div className="mt-6 flex items-center text-xs font-black text-neuro-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Full Entry <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
                
                <div className={`hidden sm:flex p-4 rounded-2xl transition-all shadow-inner shrink-0 ${
                  result.category === 'Neuro Trials'
                    ? 'bg-emerald-50 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                    : 'bg-slate-50 text-slate-300 group-hover:bg-neuro-600 group-hover:text-white'
                }`}>
                  <BookOpen size={28} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 md:py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner px-6">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300 shadow-inner ring-1 ring-slate-100">
            <Search size={48} />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">No articles found</h3>
          <p className="text-slate-500 mt-4 font-medium text-lg max-w-md mx-auto">
            We couldn't find a direct match for "{topic}". Try the AI Answer above or explore our clinical guides.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/guide" 
              className="w-full sm:w-auto px-10 py-4 bg-neuro-600 text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-lg shadow-neuro-200 hover:bg-neuro-700 active:scale-95 transition-all"
            >
              Browse Resident Guide
            </Link>
            <Link 
              to="/trials" 
              className="w-full sm:w-auto px-10 py-4 bg-white text-slate-600 border border-gray-200 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-slate-50 transition-all"
            >
              Clinical Trials
            </Link>
          </div>
        </div>
      )}
      
      {/* Bottom Padding for Mobile */}
      <div className="h-12 md:hidden"></div>
    </div>
  );
};

export default Wiki;
