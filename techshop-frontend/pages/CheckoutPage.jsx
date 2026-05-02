import React, { useState } from 'react';
import api from '../services/api';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Giả lập giỏ hàng (Thực tế bạn sẽ lấy từ Redux/Context hoặc LocalStorage)
  const cartItems = [
    { skuCode: "IPHONE_15_PRO", name: "iPhone 15 Pro Max 256GB", price: 29990000, quantity: 1 },
    { skuCode: "AIRPODS_PRO", name: "Tai nghe AirPods Pro 2", price: 5990000, quantity: 1 }
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setMessage('');
    
    // Format data chuẩn khớp với OrderRequest của Backend
    const orderPayload = {
      orderLineItemsDtoList: cartItems.map(item => ({
        skuCode: item.skuCode,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const response = await api.post('/order', orderPayload);
      setMessage(response.data || "Đặt hàng thành công!");
    } catch (error) {
      setMessage("Có lỗi xảy ra khi đặt hàng. Vui lòng kiểm tra lại đăng nhập hoặc số lượng kho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 max-w-4xl mx-auto">
      <h2 className="text-[32px] font-bold text-heading mb-8">Thanh toán</h2>
      
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold mb-6">Đơn hàng của bạn</h3>
        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-50">
              <div>
                <p className="font-semibold text-heading">{item.name}</p>
                <p className="text-sm text-body">Số lượng: {item.quantity}</p>
              </div>
              <p className="font-bold text-heading">{(item.price * item.quantity).toLocaleString()}đ</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-medium text-body">Tổng cộng:</span>
          <span className="text-2xl font-bold text-primary">{total.toLocaleString()}đ</span>
        </div>

        {message && (
          <div className={`p-4 rounded-[12px] mb-6 text-center font-medium ${message.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-error'}`}>
            {message}
          </div>
        )}

        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full h-14 bg-primary text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;