import React from 'react';
import type { EmailExample } from '../data/examples';

interface ExampleSelectorProps {
  examples: EmailExample[];
  onSelectExample: (content: string) => void;
}

const ExampleSelector: React.FC<ExampleSelectorProps> = ({ examples, onSelectExample }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedContent = event.target.value;
    if (selectedContent) {
      onSelectExample(selectedContent);
      // Reset dropdown to placeholder after selection to allow re-selecting the same example
      event.target.value = "";
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="example-select" className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
        <LightbulbIcon className="w-5 h-5 mr-2 text-yellow-400" />
        Need an example? Load one here.
      </label>
      <select
        id="example-select"
        onChange={handleChange}
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 cursor-pointer"
        defaultValue=""
        aria-label="Select an example email to load"
      >
        <option value="" disabled>
          Select an email to test...
        </option>
        {examples.map((example) => (
          <option key={example.name} value={example.content}>
            {example.name}
          </option>
        ))}
      </select>
    </div>
  );
};

function LightbulbIcon({ className = '' }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.42 0-2.798-.382-4.007-1.034a.75.75 0 0 1-.22-.516m12.454 0a.75.75 0 0 0-.22-.516C6.546 16.48 5.17 16.1 3.75 16.1a7.5 7.5 0 0 1 0-15c1.42 0 2.798.382 4.007 1.034a.75.75 0 0 1 .22.516m-12.454 0a.75.75 0 0 0 .22.516c1.209.652 2.587 1.034 4.007 1.034a7.5 7.5 0 0 1 7.5 0c1.42 0 2.798-.382 4.007-1.034a.75.75 0 0 0 .22-.516M12 4.5v.75m0 10.5v.75" />
        </svg>
    );
}

export default ExampleSelector;
