
import React from 'react';
import { AnalysisData, PredictionResult } from '../types';

interface ResultCardProps {
  data: AnalysisData;
}

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const isPneumonia = data.prediction === PredictionResult.PNEUMONIA;

  return (
    <div className={`p-8 rounded-3xl border-2 overflow-hidden relative ${
      isPneumonia 
        ? 'bg-red-50 border-red-100' 
        : 'bg-emerald-50 border-emerald-100'
    } shadow-sm`}>
      {/* Decorative accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 ${isPneumonia ? 'bg-red-600' : 'bg-emerald-600'}`}></div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="flex-shrink-0">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 ${
            isPneumonia ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            <div className="text-center">
              <span className="block text-[8px] uppercase tracking-widest font-black opacity-60">Result</span>
              <span className="block text-2xl font-black">
                {isPneumonia ? 'POS' : 'NEG'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {data.prediction} Detected
            </h3>
            <div className="text-[10px] font-mono text-slate-400 bg-white/50 px-2 py-1 rounded-md border border-slate-100">
              SCAN_ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-black ${isPneumonia ? 'text-red-700' : 'text-emerald-700'}`}>
                  {data.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analysis Time</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-slate-700">1.4s</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-200/50 h-3 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                isPneumonia ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              }`}
              style={{ width: `${data.confidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
