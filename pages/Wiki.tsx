import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GUIDE_CONTENT } from '../data/guideContent';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';

const Wiki: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const query = topic?.toLowerCase() || '';

  const results = Object.values(GUIDE_CONTENT).filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.content.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-neuro-600 transition-colors mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Search Results for <span className="text-neuro-600">"{topic}"</span>
        </h1>
        <p className="text-slate-500 mt-2">Found {results.length} matching articles in the catalogue.</p>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-6">
          {results.map((result) => (
            <Link key={result.id} to={`/guide/${result.id}`} className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-neuro-300 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-neuro-600 uppercase tracking-wide bg-neuro-50 px-2 py-1 rounded">
                    {result.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-neuro-700">
                    {result.title}
                  </h2>
                  <p className="text-slate-500 mt-2 line-clamp-2">
                    {result.content.replace(/#/g, '').substring(0, 150)}...
                  </p>
                </div>
                <BookOpen className="text-slate-300 group-hover:text-neuro-500 transition-colors" size={24} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No articles found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search terms or browse the Resident Guide.</p>
          <Link to="/guide" className="inline-block mt-4 px-4 py-2 bg-neuro-600 text-white rounded-lg hover:bg-neuro-700 transition-colors">
            Browse Guide
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wiki;