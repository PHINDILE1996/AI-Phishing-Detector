import React, { useState, useCallback } from 'react';
import { analyzeEmailContent } from './services/geminiService';
import type { AnalysisResult } from './types';
import EmailInput from './components/EmailInput';
import AnalysisResultDisplay from './components/AnalysisResult';
import ExampleSelector from './components/ExampleSelector';
import { examples } from './data/examples';

const App: React.FC = () => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeEmailContent(emailContent);
      setAnalysisResult(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [emailContent]);

  const handleExampleSelect = (content: string) => {
    setEmailContent(content);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
            <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm-1.5 6.236a3 3 0 0 1-3-3l1.5-1.5a3 3 0 0 1 3 3l-1.5 1.5Z" />
                </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                AI Phishing Detector
            </h1>
            <p className="mt-3 text-lg text-gray-400 max-w-xl mx-auto">
                Paste an email's content below to scan for malicious signs and get a detailed safety report.
            </p>
        </header>

        <main className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl shadow-2xl shadow-blue-900/10">
          <ExampleSelector examples={examples} onSelectExample={handleExampleSelect} />
          <EmailInput
            emailContent={emailContent}
            setEmailContent={setEmailContent}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
          
          {(isLoading || analysisResult || error) && (
              <>
                <div className="my-6 border-t border-gray-700"></div>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-6 text-gray-400">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-lg font-semibold">Analyzing your email...</p>
                        <p className="text-sm">This may take a moment.</p>
                    </div>
                )}
                <AnalysisResultDisplay result={analysisResult} error={error} />
              </>
          )}

        </main>
        
        <footer className="text-center mt-8">
            <p className="text-sm text-gray-500">Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
