
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GUIDE_CONTENT } from '../data/guideContent';
import { ArrowLeft, BookOpen, Search, ChevronRight } from 'lucide-react';

const Wiki: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const query = topic?.toLowerCase() || '';

  const results = Object.values(GUIDE_CONTENT).filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.content.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

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
          className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-neuro-600 transition-colors duration-150 group mb-6 min-h-[44px] touch-manipulation active:scale-95 transform-gpu focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none"
        >
            <div className="bg-white p-3 rounded-lg border border-slate-100 mr-3 shadow-sm group-hover:shadow-md transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center">
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

      {results.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {results.map((result) => (
            <Link 
              key={result.id} 
              to={result.category === 'Neuro Trials' ? `/trials/${result.id}` : `/guide/${result.id}`} 
              className="block bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-neuro-100 hover:-translate-y-1  transition-colors duration-150 group relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neuro-50 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity -mr-16 -mt-16"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
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
                
                <div className={`hidden sm:flex p-4 rounded-2xl transition-colors duration-150 shadow-inner shrink-0 ${
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
            We couldn't find a direct match for "{topic}". Try adjusting your search or explore our clinical guides.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/guide" 
              className="w-full sm:w-auto px-10 py-4 bg-neuro-600 text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-lg shadow-neuro-200 hover:bg-neuro-700 active:scale-95 transform-gpu transition-colors duration-150"
            >
              Browse Resident Guide
            </Link>
            <Link 
              to="/trials" 
              className="w-full sm:w-auto px-10 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-slate-50 transition-colors duration-150"
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
