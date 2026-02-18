
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mb-12 text-center">
      <div className="inline-flex items-center justify-center p-3 mb-4 bg-blue-100 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        AI Pneumonia Detection
      </h1>
      <p className="mt-3 text-lg text-slate-500">
        Professional deep learning analysis for Chest X-ray imaging.
      </p>
    </header>
  );
};

export default Header;
