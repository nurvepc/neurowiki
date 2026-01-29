import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function TrialSearch() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  // This is a placeholder - you'll build out the full trial database later
  const relevantTrials = [
    'SITS-MOST', 'NINDS rt-PA', 'IST-3', 'PRISMS', 'DAWN', 'DEFUSE-3',
    'AHA/ASA Guidelines', 'ENCHANTED', 'GIST-UK', 'RACE Scale'
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-black mb-4 text-gray-900 dark:text-white">Trial Reference</h1>
      {search && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Searching for: <span className="font-semibold">{search}</span>
        </p>
      )}
      
      <div className="space-y-4">
        {relevantTrials.filter(t => t.toLowerCase().includes(search.toLowerCase())).map(trial => (
          <div key={trial} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{trial}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Trial details coming soon. This will link to full trial summary.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
