import { useState } from 'react';

function App() {
  const [text, setText] = useState(''); 
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        body: JSON.stringify({ text }),
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
  return (
    <div className = "min-h-screen bg-gray-100 px-4 py-8">
      <div className = "max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className = "text-2xl font-bold mb-4 text-center">AI Summarizer</h1>
        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='Enter text to summarize...'
          value = {text}
          onChange = {(e) => setText(e.target.value)}
          />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4 disabled:opacity-50"
          onClick = {handleSummarize}
          disabled = {loading}>
            {loading ? 'Summarizing...' : 'Summarize'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {summary && (
          <div className="bg-gray-50 p-4 border border-gray-300 rounded">
            <h2 className="font-semibold mb-2">Summary:</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
