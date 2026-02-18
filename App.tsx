
import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import ResultCard from './components/ResultCard';
import ExplanationPanel from './components/ExplanationPanel';
import { AnalysisData, FileData, PredictionResult } from './types';
import { generateMedicalExplanation } from './services/geminiService';
import { predictPneumonia } from './services/apiService';

// Fix: Change 'False' to 'false' as boolean literals are lowercase in TypeScript.
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
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
      const backendResult = await predictPneumonia(selectedFile.file);
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
        explanation: medicalExplanation
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. Please check if the Flask backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Sidebar - Desktop Only */}
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
          <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Settings" />
        </nav>

        <div className="p-4 bg-slate-50 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Load</p>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="font-bold text-slate-800">Chest Radiology Center</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-[10px] font-bold text-green-600 uppercase tracking-wider">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
               Model: v2.4 Active
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </nav>

        <main className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBadge label="Total Scans" value="1,284" color="blue" />
            <StatBadge label="Detections" value="342" color="amber" />
            <StatBadge label="Accuracy" value="98.2%" color="green" />
            <StatBadge label="Uptime" value="99.9%" color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Input */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Analysis Terminal
                  </h3>
                </div>

                <div className="relative">
                  {isAnalyzing && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
                      <div className="w-full h-1 bg-blue-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    </div>
                  )}
                  <UploadArea 
                    onFileSelect={handleFileSelect} 
                    selectedFile={selectedFile} 
                  />
                </div>

                <div className="mt-8">
                  <button
                    onClick={performAnalysis}
                    disabled={!selectedFile || isAnalyzing}
                    className={`group w-full px-8 py-5 text-lg font-bold rounded-2xl transition-all flex items-center justify-center gap-3 ${
                      !selectedFile || isAnalyzing
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 hover:scale-[1.01] active:scale-95'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Analyzing Neural Patterns...
                      </>
                    ) : (
                      <>Run Diagnostic Scan</>
                    )}
                  </button>
                </div>
              </section>

              {analysisResult && (
                <div className="space-y-6 transition-all animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <ResultCard data={analysisResult} />
                </div>
              )}
            </div>

            {/* Right Column: Reports & Status */}
            <div className="space-y-6">
              {analysisResult ? (
                <ExplanationPanel explanation={analysisResult.explanation} />
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h4 className="font-bold text-slate-800">Awaiting Analysis</h4>
                  <p className="text-sm text-slate-400 max-w-[200px]">Upload and analyze an X-ray to generate a clinical radiology report.</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl animate-in slide-in-from-right-10 duration-500">
                  <div className="flex items-center gap-3 text-red-700 font-bold mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Engine Warning
                  </div>
                  <p className="text-xs text-red-600 mb-4">{error}</p>
                  <div className="bg-red-600/10 p-3 rounded-lg">
                    <p className="text-[10px] text-red-700 font-mono">Ensure local Flask server is active on :5000</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-blue-100">
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-2">Radiology Tip</h4>
                  <p className="text-sm text-blue-100 leading-relaxed">Ensure patient position is PA (Posteroanterior) for the most accurate lung field segmentation and transparency analysis.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
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
