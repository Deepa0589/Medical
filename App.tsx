
import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import ResultCard from './components/ResultCard';
import ExplanationPanel from './components/ExplanationPanel';
import { AnalysisData, FileData, PredictionResult } from './types';
import { generateMedicalExplanation } from './services/geminiService';
import { predictPneumonia } from './services/apiService';

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </div>
);

const StatBadge = ({ label, value, color }: { label: string, value: string, color: 'blue' | 'green' | 'amber' }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-xl font-black text-${color}-600`}>{value}</span>
  </div>
);

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<(AnalysisData & { isSimulated?: boolean }) | null>(null);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: FileData) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) resolve(base64String);
        else reject(new Error('Failed to convert file to base64'));
      };
      reader.onerror = error => reject(error);
    });
  };

  const performAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      // 1. Prediction (with fallback)
      const backendResult = await predictPneumonia(selectedFile.file);
      setIsSimulatedMode(!!backendResult.isSimulated);

      // 2. Clinical Context
      const base64Image = await fileToBase64(selectedFile.file);
      const medicalExplanation = await generateMedicalExplanation(
        backendResult.prediction, 
        backendResult.confidence, 
        base64Image
      );

      setAnalysisResult({
        prediction: backendResult.prediction,
        confidence: backendResult.confidence,
        timestamp: new Date().toLocaleString(),
        explanation: medicalExplanation,
        isSimulated: backendResult.isSimulated
      });
    } catch (err: any) {
      console.error(err);
      setError('System Error: Unable to process analysis. Please check image format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">MED.AI</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem active icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" /></svg>} label="Dashboard" />
          <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} label="Patients" />
          <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="History" />
        </nav>

        <div className="p-4 bg-slate-50 rounded-2xl mt-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Connectivity</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSimulatedMode ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[11px] font-semibold text-slate-600">
              {isSimulatedMode ? 'Local Simulation' : 'Production Engine'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="font-bold text-slate-800">Chest Radiology Dashboard</h2>
          <div className="flex items-center gap-4">
             {isSimulatedMode && (
               <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                 SIMULATION ACTIVE
               </div>
             )}
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"></div>
          </div>
        </nav>

        <main className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBadge label="Total Scans" value="1,284" color="blue" />
            <StatBadge label="Detections" value="342" color="amber" />
            <StatBadge label="Accuracy" value="98.2%" color="green" />
            <StatBadge label="Engine" value={isSimulatedMode ? "LOCAL" : "FLASK"} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Analysis Terminal
                  </h3>
                  {isSimulatedMode && (
                    <span className="text-[10px] text-slate-400 font-mono">BACKEND_FALLBACK: ON</span>
                  )}
                </div>

                <div className="relative">
                  {isAnalyzing && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
                      <div className="w-full h-1 bg-blue-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    </div>
                  )}
                  <UploadArea onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                </div>

                <button
                  onClick={performAnalysis}
                  disabled={!selectedFile || isAnalyzing}
                  className={`mt-8 w-full py-5 text-lg font-bold rounded-2xl transition-all flex items-center justify-center gap-3 ${
                    !selectedFile || isAnalyzing
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
                  }`}
                >
                  {isAnalyzing ? 'Analyzing Clinical Biomarkers...' : 'Run Diagnostic Scan'}
                </button>
              </section>

              {analysisResult && (
                <ResultCard data={analysisResult} />
              )}
            </div>

            <div className="space-y-6">
              {analysisResult ? (
                <ExplanationPanel explanation={analysisResult.explanation} />
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h4 className="font-bold text-slate-800">Awaiting Data</h4>
                  <p className="text-sm text-slate-400 max-w-[200px]">Radiology report will generate automatically after scan.</p>
                </div>
              )}

              {isSimulatedMode && (
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                  <p className="text-amber-800 text-[11px] font-bold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 8a1 1 0 00-1 1v-3a1 1 0 00-2 0v3a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Simulation Mode Active
                  </p>
                  <p className="text-amber-600 text-[10px] leading-relaxed">
                    The local Flask server (port 5000) was unreachable. The system has shifted to local heuristic simulation to maintain operational workflow.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
