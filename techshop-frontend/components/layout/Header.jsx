import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-50">
    <Link to="/" className="text-2xl font-black text-primary tracking-tighter">TECHSHOP</Link>
    <nav className="flex items-center space-x-8">
      <Link to="/" className="text-heading font-medium hover:text-primary transition-colors">Sản phẩm</Link>
      <Link to="/login" className="px-6 py-2 border border-primary text-primary rounded-full font-semibold hover:bg-blue-50 transition-all">Đăng nhập</Link>
    </nav>
  </header>
);

export default Header;