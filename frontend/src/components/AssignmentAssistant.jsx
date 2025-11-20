import { useState, useRef } from 'react';
import api from '../utils/axiosConfig';
import DashboardLayout from './DashboardLayout';
import { marked } from 'marked';

export default function AssignmentAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const send = async (question, quickAction) => {
    if (!question) return;
    const newMsg = { role: 'student', text: question };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);
    try {
      const res = await api.post('/learning/assistant', { userId: user.id || user._id, role: user.role, question });
      const { answer, steps = [], hints = [], sources = [], meta } = res.data;
      setMessages(prev => [...prev, { role: 'assistant', text: answer, steps, hints, sources, meta }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error: Assistant unavailable' }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <DashboardLayout role={user.role}>
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">AI Assignment Assistant</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Ask me anything about your assignments</h2>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90" onClick={() => send('Explain step-by-step')}>Explain step-by-step</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200" onClick={() => send('Show example')}>Show example</button>
            </div>
          </div>

          <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50" role="log">
            {messages.length === 0 && <div className="text-gray-500 text-center py-8">Ask a question about your assignment to get started.</div>}
            {messages.map((m, i) => (
              <div key={i} className={`mb-4 ${m.role === 'assistant' ? 'text-left' : 'text-right'}`}>
                <div className={`${m.role === 'assistant' ? 'bg-white border' : 'bg-primary text-white'} inline-block p-4 rounded-lg max-w-[80%]`}> 
                  <div dangerouslySetInnerHTML={{ __html: marked(m.text || '') }} />
                  {m.steps && m.steps.length > 0 && (
                    <ol className="mt-2 list-decimal list-inside text-sm text-gray-700">
                      {m.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ol>
                  )}
                  {m.hints && m.hints.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">Hints: {m.hints.join(', ')}</div>
                  )}
                  {m.meta?.notice && (
                    <div className="mt-2 text-xs text-amber-600">
                      {m.meta.notice}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2">
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Type your question..." className="flex-1 border rounded-lg px-4 py-2" />
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90" disabled={loading}>{loading ? 'Thinking...' : 'Send'}</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
