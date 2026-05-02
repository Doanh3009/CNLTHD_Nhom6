import React, { useState } from 'react';
import api from '../../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    const userMsg = { role: 'user', text: message };
    setChatLog([...chatLog, userMsg]);
    setMessage('');
    try {
      const res = await api.post('/chatbot/ask', { message });
      setChatLog(prev => [...prev, { role: 'ai', text: res.data.response }]);
    } catch {
      setChatLog(prev => [...prev, { role: 'ai', text: 'Xin lỗi, tôi đang bận!' }]);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
          💬
        </button>
      ) : (
        <div className="w-80 h-[450px] bg-white rounded-[24px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-bounce-in">
          <div className="bg-primary p-4 text-white font-bold flex justify-between">
            <span>TechBot AI</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {chatLog.map((c, i) => (
              <div key={i} className={`p-3 rounded-[15px] max-w-[85%] text-sm ${c.role === 'user' ? 'bg-blue-100 ml-auto text-heading' : 'bg-white text-body shadow-sm'}`}>
                {c.text}
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex space-x-2">
            <input value={message} onChange={e => setMessage(e.target.value)} className="flex-1 text-sm outline-none" placeholder="Hỏi gì đó..." />
            <button onClick={sendMessage} className="text-primary font-bold">Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;