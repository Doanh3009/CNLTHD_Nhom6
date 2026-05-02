import React, { useState } from 'react';
import api from '../../services/api';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="w-full max-w-md p-10 bg-white rounded-[24px] shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-heading text-center mb-8">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Tên đăng nhập" className="w-full h-12 px-5 border border-inputBorder rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                 onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="Mật khẩu" className="w-full h-12 px-5 border border-inputBorder rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                 onChange={e => setForm({...form, password: e.target.value})} required />
          {error && <p className="text-error text-sm text-center font-medium">{error}</p>}
          <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;