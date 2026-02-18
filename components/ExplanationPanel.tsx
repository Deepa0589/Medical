
import React from 'react';

interface ExplanationPanelProps {
  explanation: string;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in duration-1000">
      <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="font-black text-slate-800 tracking-tight">Clinical Report</h3>
        </div>
        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download PDF
        </button>
      </div>
      
      <div className="p-8 flex-1">
        <div className="max-w-none">
          <div className="font-serif text-slate-700 leading-[1.8] text-[15px] space-y-6">
            {/* Split explanation into paragraphs for better rendering if it has markdown-style breaks */}
            {explanation.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="relative pl-4 border-l-2 border-slate-100 py-1">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          <div>
            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">DR. GEMINI-FLASH</p>
            <p className="text-[9px] text-slate-400">Chief Radiology AI</p>
          </div>
        </div>
        <div className="text-[9px] font-mono text-slate-300 uppercase">
          EHR_STAMP: {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;
