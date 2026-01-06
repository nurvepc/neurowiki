import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, ChevronRight, Zap, Activity, Microscope, Calculator } from 'lucide-react';

const categories = [
  { name: 'Vascular Neurology', icon: <Activity className="text-red-500" />, desc: 'Stroke, TIA, Hemorrhage' },
  { name: 'Movement Disorders', icon: <Activity className="text-orange-500" />, desc: 'Parkinson\'s, Tremor, Dystonia' },
  { name: 'Epilepsy', icon: <Zap className="text-yellow-500" />, desc: 'Seizures, Status Epilepticus' },
  { name: 'Neuromuscular', icon: <Activity className="text-green-500" />, desc: 'ALS, Myasthenia Gravis, Neuropathy' },
  { name: 'Neuroimmunology', icon: <Microscope className="text-blue-500" />, desc: 'Multiple Sclerosis, NMOSD' },
  { name: 'Cognitive', icon: <Brain className="text-purple-500" />, desc: 'Alzheimer\'s, Dementia, MCI' },
];

const featuredCalculators = [
  { id: 'gcs', name: 'Glasgow Coma Scale', desc: 'Assess level of consciousness after TBI' },
  { id: 'abcd2', name: 'ABCD² Score', desc: 'Estimate stroke risk after TIA' },
  { id: 'cha2ds2', name: 'CHA₂DS₂-VASc', desc: 'Stroke risk in Atrial Fibrillation' },
];

const Home: React.FC = () => {
  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            The Digital <span className="text-neuro-600">Neurology</span> Companion
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Welcome to NeuroWiki. Access comprehensive neurological protocols, clinical calculators, and hospital guidelines instantly.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/wiki/Stroke" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-neuro-100 hover:text-neuro-700 transition">Search: Stroke</Link>
            <Link to="/wiki/Sclerosis" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-neuro-100 hover:text-neuro-700 transition">Search: Sclerosis</Link>
            <Link to="/wiki/Meningitis" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-neuro-100 hover:text-neuro-700 transition">Search: Meningitis</Link>
          </div>
        </div>
        <div className="hidden md:block">
            <div className="w-48 h-48 bg-neuro-50 rounded-full flex items-center justify-center">
                <Brain size={80} className="text-neuro-500 opacity-80" />
            </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Browse by Subspecialty</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/wiki/${cat.name}`} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-neuro-200 transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-neuro-50 transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-neuro-600 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{cat.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Calculators Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Clinical Calculators</h2>
            <Link to="/calculators" className="text-neuro-600 text-sm font-semibold hover:text-neuro-800 flex items-center">
                View all <ChevronRight size={16} />
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCalculators.map(calc => (
                <Link key={calc.id} to={`/calculators?id=${calc.id}`} className="block bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                        <Calculator className="text-neuro-500" size={20} />
                        <h3 className="font-bold text-slate-800">{calc.name}</h3>
                    </div>
                    <p className="text-sm text-slate-500">{calc.desc}</p>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;