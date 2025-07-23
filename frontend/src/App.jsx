import { useState } from 'react';

function App() {
  const [text, setText] = useState(''); 
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [length, setLength] = useState('medium'); // Default length

  const handleSummarize = async () =>{
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setSummary('');

    try{
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, length }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to summarize text');
      } 
      setSummary(data.summary);
    }
    catch (err) {
      setError('Error generating summary: ' + err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleCopy = async () =>{
    if (summary) {
      try{
        await navigator.clipboard.writeText(summary);
        alert('Summary copied to clipboard!');
      } catch(err) {
        console.error('Failed to copy summary:', err);
        alert('Failed to copy summary. Please try again.'); 
      }
    }
  };

  const handleClear = () => {
    setText('');
    setSummary('');
    setError('');
  };


  return (
    <div className = "min-h-screen bg-gray-100 px-4 py-8 sm:px-8">
      <div className = "max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className = "text-2xl font-bold mb-4 text-center">AI Summarizer</h1>

        <div className='mb-4'>
          <label className = "block font-semibold mb-1">Summary Length:</label>
          <select
            className="ml-2 p-2 border border-gray-300 rounded"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='Enter text to summarize...'
          value = {text}
          onChange = {(e) => {
            setText(e.target.value)
            e.target.style.height = "auto"; // Reset height
            e.target.style.height = e.target.scrollHeight + "px"; // Set to scroll height;
            }}
          />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4 disabled:opacity-50"
          onClick = {handleSummarize}
          disabled = {loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Summarizing...
              </span>
            ) : (
              'Summarize'
            )}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {summary && (
          <div className="bg-gray-50 p-4 border border-gray-300 rounded">
            <h2 className="font-semibold mb-2">Summary:</h2>
            <p className = "pb-4">{summary}</p>
            <button
              onClick={handleCopy}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
            >
              Copy Summary
            </button>
            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm ml-2"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
