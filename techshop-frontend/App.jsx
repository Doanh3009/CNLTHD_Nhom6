import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([{ role: 'ai', text: 'Xin chào! Trợ lý TechShop có thể giúp gì cho bạn?' }]);

  // Gọi API lấy dữ liệu từ Backend
  useEffect(() => {
    axios.get('http://localhost:8181/api/product')
      .then(res => setProducts(res.data))
      .catch(err => console.log("Chưa kết nối được Backend:", err));
  }, []);

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    setChatLog([...chatLog, { role: 'user', text: chatMessage }]);
    const currentMsg = chatMessage;
    setChatMessage('');
    
    try {
      const res = await axios.post('http://localhost:8181/api/chatbot/ask', { message: currentMsg });
      setChatLog(prev => [...prev, { role: 'ai', text: res.data.response || res.data }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'ai', text: 'Hệ thống AI đang bận, vui lòng thử lại sau.' }]);
    }
  };

  return (
    <div className="min-h-screen font-sans text-[#5D6C7B]">
      
      {/* HEADER */}
      <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
        <div className="text-2xl font-black text-[#0064E0] tracking-tighter">TECHSHOP</div>
        <nav className="flex items-center space-x-8">
          <a href="#" className="text-[#1C2B33] font-medium hover:text-[#0064E0] transition-colors">Sản phẩm</a>
          {/* Pill Button */}
          <button className="px-6 py-2 border border-[#0064E0] text-[#0064E0] rounded-[100px] font-semibold hover:bg-blue-50 transition-all">
            Đăng nhập
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT - Section padding 64px */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-[32px] font-bold text-[#1C2B33] mb-12">Sản phẩm nổi bật</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-gray-50 rounded-[20px] border border-gray-100">
              <p className="text-lg font-medium text-[#1C2B33]">Đang kết nối Backend...</p>
              <p className="text-sm mt-2">Nếu quá lâu, hãy kiểm tra lại Docker Compose (Cổng 8181).</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
                
                {/* ẢNH SẢN PHẨM & GRADIENT SCRIM */}
                <div className="relative h-72 bg-gray-50 overflow-hidden">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"} 
                    alt="Product" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white font-medium truncate">{product.name}</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1C2B33] mb-2 truncate">{product.name}</h3>
                  <p className="text-sm mb-6 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#1C2B33]">{Number(product.price).toLocaleString()}đ</span>
                    {/* Pill Button CTA */}
                    <button className="bg-[#0064E0] text-white px-6 py-2 rounded-[100px] font-semibold hover:bg-blue-700 transition-colors">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* CHATBOT NỔI */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="w-16 h-16 bg-[#0064E0] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform text-2xl"
          >
            💬
          </button>
        ) : (
          <div className="w-[350px] h-[500px] bg-white rounded-[24px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
            <div className="bg-[#0064E0] p-4 text-white font-bold flex justify-between items-center">
              <span>Trợ lý AI TechShop</span>
              <button onClick={() => setIsChatOpen(false)} className="text-xl font-light hover:text-gray-200">✕</button>
            </div>
            
            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4">
              {chatLog.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-[16px] max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[#0064E0] text-white' : 'bg-white border border-gray-100 shadow-sm text-[#1C2B33]'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100 bg-white flex space-x-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Nhập câu hỏi..." 
                className="flex-1 px-4 py-2 border border-[#CED0D4] rounded-[100px] outline-none focus:border-[#0064E0] text-sm"
              />
              <button onClick={handleSendChat} className="bg-[#0064E0] text-white px-5 py-2 rounded-[100px] font-bold text-sm hover:bg-blue-700">
                Gửi
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;     