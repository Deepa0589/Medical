
import React, { useCallback, useState } from 'react';
import { FileData } from '../types';

interface UploadAreaProps {
  onFileSelect: (fileData: FileData) => void;
  selectedFile: FileData | null;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const previewUrl = URL.createObjectURL(file);
      onFileSelect({ file, previewUrl });
    }
  }, [onFileSelect]);

  return (
    <div 
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full aspect-video md:aspect-[21/9] rounded-2xl transition-all duration-500 border-2 border-dashed flex flex-col items-center justify-center overflow-hidden ${
        isDragging 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
          : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200'
      }`}
    >
      {selectedFile ? (
        <div className="w-full h-full relative group">
          <img 
            src={selectedFile.previewUrl} 
            alt="X-ray Preview" 
            className="w-full h-full object-contain bg-black transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <button 
              onClick={(e) => { e.stopPropagation(); onFileSelect(null as any); }}
              className="px-6 py-2 bg-white text-red-600 rounded-full font-bold shadow-xl hover:bg-red-50 transform hover:scale-110 transition-all"
            >
              Replace Scan
            </button>
          </div>
          {/* Scientific Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none">
             <div className="text-[10px] font-mono text-emerald-400 bg-black/40 px-2 py-1 rounded">IMAGE_BUFFER: RAW</div>
          </div>
        </div>
      ) : (
        <label className="cursor-pointer group flex flex-col items-center p-12">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 group-hover:text-blue-500 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="font-bold text-slate-700 mb-1">Upload Radiological Imaging</p>
          <p className="text-sm text-slate-400">Click to browse or drag and drop DICOM/JPG</p>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
            if (e.target.files?.[0]) {
               const file = e.target.files[0];
               onFileSelect({ file, previewUrl: URL.createObjectURL(file) });
            }
          }} />
        </label>
      )}
    </div>
  );
};

export default UploadArea;
