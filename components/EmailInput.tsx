
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface EmailInputProps {
  emailContent: string;
  setEmailContent: (content: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ emailContent, setEmailContent, onAnalyze, isLoading }) => {
  return (
    <div className="w-full">
      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder="Paste the full email content here, including headers for a more accurate analysis..."
        className="w-full h-64 p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-y placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading || !emailContent.trim()}
        className="mt-4 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5 mr-2" />
            Analyzing...
          </>
        ) : (
          'Analyze Email'
        )}
      </button>
    </div>
  );
};

export default EmailInput;
