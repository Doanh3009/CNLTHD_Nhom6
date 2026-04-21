import React, { useState } from 'react';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Có lỗi xảy ra, tên đăng nhập hoặc email có thể đã tồn tại.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="w-full max-w-md p-10 bg-white rounded-[24px] shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-heading text-center mb-2">Tạo tài khoản</h2>
        <p className="text-body text-center mb-8">Tham gia TechShop ngay hôm nay</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Tên đăng nhập" className="w-full h-12 px-5 border border-inputBorder rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                 onChange={e => setForm({...form, username: e.target.value})} required />
          
          <input type="email" placeholder="Email" className="w-full h-12 px-5 border border-inputBorder rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                 onChange={e => setForm({...form, email: e.target.value})} required />
                 
          <input type="password" placeholder="Mật khẩu" className="w-full h-12 px-5 border border-inputBorder rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                 onChange={e => setForm({...form, password: e.target.value})} required />
          
          {error && <p className="text-error text-sm text-center font-medium">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center font-medium">{success}</p>}
          
          <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg mt-4">
            Đăng ký
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-primary hover:underline font-medium">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;