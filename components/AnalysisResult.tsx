
import React from 'react';
import type { AnalysisResult, Finding, ExtractedLink } from '../types';

interface AnalysisResultProps {
  result: AnalysisResult | null;
  error: string | null;
}

const riskLevelColors: Record<string, { bg: string; text: string; ring: string }> = {
  Safe: { bg: 'bg-green-800', text: 'text-green-300', ring: 'ring-green-500' },
  Low: { bg: 'bg-yellow-800', text: 'text-yellow-300', ring: 'ring-yellow-500' },
  Medium: { bg: 'bg-orange-800', text: 'text-orange-300', ring: 'ring-orange-500' },
  High: { bg: 'bg-red-800', text: 'text-red-300', ring: 'ring-red-500' },
  Critical: { bg: 'bg-red-900', text: 'text-red-200', ring: 'ring-red-600' },
};

const severityIcons: Record<string, JSX.Element> = {
  Info: <InfoIcon />,
  Low: <WarningIcon className="text-yellow-400" />,
  Medium: <WarningIcon className="text-orange-400" />,
  High: <DangerIcon className="text-red-400" />,
};

const linkRiskIcons: Record<string, JSX.Element> = {
  Safe: <CheckCircleIcon className="text-green-400" />,
  Suspicious: <WarningIcon className="text-yellow-400" />,
  Malicious: <DangerIcon className="text-red-400" />,
}

const ScoreMeter: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  
  let strokeColor = 'stroke-green-500';
  if (score >= 40) strokeColor = 'stroke-yellow-500';
  if (score >= 70) strokeColor = 'stroke-orange-500';
  if (score >= 90) strokeColor = 'stroke-red-500';

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle className="stroke-gray-700" strokeWidth="10" fill="transparent" r="52" cx="60" cy="60" />
        <circle
          className={`${strokeColor} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-sm text-gray-400">Score</span>
      </div>
    </div>
  );
};


const AnalysisResultDisplay: React.FC<AnalysisResultProps> = ({ result, error }) => {
  if (error) {
    return <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">{error}</div>;
  }
  if (!result) {
    return (
        <div className="mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-400">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-blue-500" />
            <p className="mt-2">Your analysis results will appear here.</p>
        </div>
    );
  }

  const colors = riskLevelColors[result.riskLevel] || riskLevelColors.Low;

  return (
    <div className="mt-6 w-full space-y-6 animate-fade-in">
      {/* Summary Section */}
      <div className={`p-6 rounded-xl border border-gray-700 bg-gray-800 shadow-lg`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreMeter score={result.probabilityScore} />
          <div className="flex-1 text-center md:text-left">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors.bg} ${colors.text}`}>
              {result.riskLevel} Risk
            </span>
            <h2 className="text-2xl font-bold mt-2 text-white">Analysis Complete</h2>
            <p className="text-gray-400 mt-1">{result.summary}</p>
          </div>
        </div>
      </div>
      
      {/* Findings Section */}
      {result.findings.length > 0 && (
        <div className="p-6 rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
            Detailed Findings
          </h3>
          <ul className="space-y-4">
            {result.findings.map((finding: Finding, index: number) => (
              <li key={index} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 mt-1">{severityIcons[finding.severity]}</div>
                <div>
                  <h4 className="font-semibold text-white">{finding.indicator}</h4>
                  <p className="text-gray-400 text-sm">{finding.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Links Section */}
      {result.extractedLinks.length > 0 && (
        <div className="p-6 rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <LinkIcon className="h-6 w-6 mr-2" />
            Link Analysis
          </h3>
          <ul className="space-y-3">
            {result.extractedLinks.map((link: ExtractedLink, index: number) => (
              <li key={index} className="flex items-start gap-4 p-3 bg-gray-900/50 rounded-lg">
                <div className="flex-shrink-0 w-5 h-5 mt-1">{linkRiskIcons[link.risk]}</div>
                <div className="flex-1">
                  <p className="text-blue-400 break-all text-sm font-mono">{link.url}</p>
                  <p className="text-gray-400 text-xs mt-1">{link.analysis}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultDisplay;

// SVG Icons
function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  );
}

function WarningIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

function DangerIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  );
}

function CheckCircleIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

// FIX: Accept className prop to allow custom styling and fix type error.
function LinkIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  );
}

// FIX: Accept className prop to allow custom styling and fix type error.
function MagnifyingGlassIcon({ className = '' }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    );
}

function ShieldCheckIcon({className = ''}: {className?: string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm-1.5 6.236a3 3 0 0 1-3-3l1.5-1.5a3 3 0 0 1 3 3l-1.5 1.5Z" />
        </svg>
    );
}
