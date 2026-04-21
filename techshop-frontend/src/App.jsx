import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/* ============================================================
   MOCK DATA — hiển thị khi chưa kết nối BE
   ============================================================ */
const MOCK_PRODUCTS = [
  { id: '1', name: 'iPhone 15 Pro Max', description: 'Chip A17 Pro, camera 48MP, titanium design, màn hình 6.7" Super Retina XDR 120Hz', price: 34990000, category: 'iPhone', imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop', skuCode: 'iphone_15_pro_max' },
  { id: '2', name: 'iPhone 15', description: 'Chip A16 Bionic, Dynamic Island, camera 48MP, cổng sạc USB-C tiện lợi', price: 22990000, category: 'iPhone', imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop', skuCode: 'iphone_15' },
  { id: '3', name: 'MacBook Pro 14" M3', description: 'Chip M3 Pro, màn hình Liquid Retina XDR, pin 18 giờ, kết nối Thunderbolt 4', price: 54990000, category: 'Mac', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop', skuCode: 'macbook_pro_m3' },
  { id: '4', name: 'MacBook Air 13" M2', description: 'Thiết kế siêu mỏng nhẹ, chip M2, màn hình Liquid Retina 13.6", không có quạt tản nhiệt', price: 29990000, category: 'Mac', imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop', skuCode: 'macbook_air_m2' },
  { id: '5', name: 'iPad Pro 12.9" M2', description: 'Chip M2 mạnh mẽ, màn hình Liquid Retina XDR 12.9", hỗ trợ Apple Pencil thế hệ 2', price: 27990000, category: 'iPad', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop', skuCode: 'ipad_pro_m2' },
  { id: '6', name: 'Apple Watch Series 9', description: 'Màn hình Always-On Retina, chip S9, theo dõi sức khỏe toàn diện, sạc nhanh 8 phút', price: 11990000, category: 'Watch', imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop', skuCode: 'apple_watch_s9' },
  { id: '7', name: 'AirPods Pro 2', description: 'Chống ồn ANC thế hệ 2, âm thanh Spatial Audio, chip H2, pin 30 giờ với hộp sạc', price: 6990000, category: 'Audio', imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop', skuCode: 'airpods_pro_2' },
  { id: '8', name: 'Samsung Galaxy S24 Ultra', description: 'S Pen tích hợp, camera 200MP, Galaxy AI, màn hình Dynamic AMOLED 6.8" 120Hz', price: 31990000, category: 'Android', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop', skuCode: 'samsung_s24_ultra' },
  { id: '9', name: 'Sony WH-1000XM5', description: 'Chống ồn hàng đầu thế giới, pin 30 giờ, đa điểm kết nối, âm thanh Hi-Res Audio', price: 8990000, category: 'Audio', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop', skuCode: 'sony_wh1000xm5' },
  { id: '10', name: 'iPad Air 5 M1', description: 'Chip M1 hiệu năng cao, màn hình Liquid Retina 10.9", Touch ID, hỗ trợ 5G', price: 19990000, category: 'iPad', imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop', skuCode: 'ipad_air_m1' },
  { id: '11', name: 'Apple Watch Ultra 2', description: 'Titanium case, GPS chính xác nhất, pin 60 giờ, thiết kế cho người chơi thể thao cực đoan', price: 21990000, category: 'Watch', imageUrl: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&auto=format&fit=crop', skuCode: 'apple_watch_ultra_2' },
  { id: '12', name: 'Google Pixel 8 Pro', description: 'Camera AI tiên tiến nhất, Tensor G3, 7 năm cập nhật Android, màn hình LTPO OLED', price: 23990000, category: 'Android', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop', skuCode: 'pixel_8_pro' },
];

const CATEGORIES = ['Tất cả', 'iPhone', 'Mac', 'iPad', 'Watch', 'Audio', 'Android'];

/* ============================================================
   API
   ============================================================ */
const API_BASE = 'http://localhost:8181/api';
const apiFetch = axios.create({ baseURL: API_BASE });
apiFetch.interceptors.request.use(c => {
  const t = localStorage.getItem('token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

/* ============================================================
   TOAST HOOK
   ============================================================ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);
  return { toasts, add };
}

function ToastContainer({ toasts }) {
  const bg = { success: '#1d1d1f', error: '#ff3b30', warning: '#ff9500', info: '#0071e3' };
  return (
    <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: bg[t.type] || bg.success, color: '#fff',
          padding: '13px 20px', borderRadius: 14, fontSize: 14, fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.22)', animation: 'toastIn 0.35s ease',
          maxWidth: 320, lineHeight: 1.4,
        }}>
          {t.type === 'success' ? '✓ ' : t.type === 'error' ? '✕ ' : '• '}{t.msg}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   CART HOOK
   ============================================================ */
function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts_cart') || '[]'); } catch { return []; }
  });
  const sync = (c) => { setCart(c); localStorage.setItem('ts_cart', JSON.stringify(c)); };
  const addItem = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      const updated = exists
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
      localStorage.setItem('ts_cart', JSON.stringify(updated));
      return updated;
    });
  };
  const removeItem = (id) => sync(cart.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    sync(cart.map(i => i.id === id ? { ...i, qty } : i));
  };
  const clearCart = () => sync([]);
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const count = cart.reduce((a, i) => a + i.qty, 0);
  return { cart, addItem, removeItem, updateQty, clearCart, total, count };
}

/* ============================================================
   FORMAT PRICE
   ============================================================ */
const fmtPrice = (n) => {
  return Number(n).toLocaleString('vi-VN') + 'đ';
};

/* ============================================================
   SHARED STYLES
   ============================================================ */
const S = {
  labelStyle: { display: 'block', fontSize: 13, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 },
  formInput: {
    width: '100%', padding: '11px 14px', border: '1px solid #d2d2d7', borderRadius: 10,
    fontSize: 15, fontFamily: 'inherit', outline: 'none', background: '#fff',
    boxSizing: 'border-box', color: '#1d1d1f', transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  primaryBtnFull: {
    width: '100%', background: '#0071e3', color: '#fff', border: 'none',
    borderRadius: 100, height: 44, fontSize: 15, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', display: 'block'
  },
  qtyBtn: {
    width: 30, height: 30, border: '1px solid #d2d2d7', borderRadius: 8,
    background: '#f5f5f7', cursor: 'pointer', fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'inherit', color: '#1d1d1f', lineHeight: 1,
  },
  sectionTitle: { fontSize: 32, fontWeight: 700, color: '#1d1d1f', margin: '0 0 40px', letterSpacing: -0.5 },
};

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar({ cartCount, onCartClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/products', label: 'Sản phẩm' },
    { to: '/chat', label: 'Chat AI' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 52,
      background: scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.84)',
      backdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.12)' : '1px solid transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', transition: 'all 0.3s ease',
    }}>
      <Link to="/" style={{ fontWeight: 800, fontSize: 18, color: '#1d1d1f', letterSpacing: -0.5, textDecoration: 'none' }}>
        ⚡ TechShop
      </Link>

      {/* Center nav */}
      <div style={{ display: 'flex', gap: 32, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            fontSize: 14, color: location.pathname === l.to ? '#0071e3' : '#1d1d1f',
            textDecoration: 'none', fontWeight: location.pathname === l.to ? 600 : 400,
            transition: 'color 0.2s',
          }}>{l.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onCartClick} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, position: 'relative', padding: 4, color: '#1d1d1f' }}>
          🛍️
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2, background: '#0071e3', color: '#fff',
              borderRadius: '50%', width: 17, height: 17, fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            }}>{cartCount > 9 ? '9+' : cartCount}</span>
          )}
        </button>

        {isLoggedIn ? (
          <>
            <Link to="/checkout" style={{ fontSize: 13, color: '#0071e3', fontWeight: 500 }}>Thanh toán</Link>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/'); window.location.reload(); }} style={{
              background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 100,
              padding: '7px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#1d1d1f',
            }}>Đăng xuất</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} style={{
            background: '#0071e3', color: '#fff', border: 'none', borderRadius: 100,
            padding: '7px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>Đăng nhập</button>
        )}
      </div>
    </nav>
  );
}

/* ============================================================
   CART SIDEBAR
   ============================================================ */
function CartSidebar({ open, onClose, cart, updateQty, removeItem, total, onCheckout }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1100,
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s',
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, maxWidth: '95vw',
        background: '#fff', zIndex: 1200, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(.4,0,.2,1)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1d1d1f' }}>Giỏ hàng {cart.length > 0 && `(${cart.length})`}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#8e8e93', padding: 4, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8e8e93' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🛍️</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>Giỏ hàng trống</p>
              <p style={{ fontSize: 13 }}>Thêm sản phẩm để bắt đầu mua sắm</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f5f5f7' }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', background: '#f5f5f7', flexShrink: 0 }}>
                <img src={item.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#0071e3' }}>{fmtPrice(item.price)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={S.qtyBtn}>−</button>
                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 22, textAlign: 'center', color: '#1d1d1f' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={S.qtyBtn}>+</button>
                  <button onClick={() => removeItem(item.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, color: '#6e6e73' }}>
              <span>Vận chuyển</span><span style={{ color: '#34c759', fontWeight: 600 }}>Miễn phí</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#1d1d1f' }}>Tổng cộng</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#1d1d1f' }}>{fmtPrice(total)}</span>
            </div>
            <button onClick={onCheckout} style={{ ...S.primaryBtnFull, fontSize: 16, height: 50, borderRadius: 14 }}>
              Thanh toán →
            </button>
            <p style={{ fontSize: 11, color: '#8e8e93', textAlign: 'center', marginTop: 12 }}>
              🔒 Thanh toán bảo mật • Đổi trả 30 ngày
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ============================================================
   PRODUCT CARD
   ============================================================ */
function ProductCard({ product, onAddCart }) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', borderRadius: 20, overflow: 'hidden',
        boxShadow: hover ? '0 20px 60px rgba(0,0,0,0.13)' : '0 2px 16px rgba(0,0,0,0.07)',
        transform: hover ? 'translateY(-6px)' : 'none',
        transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ aspectRatio: '4/3', background: '#f5f5f7', overflow: 'hidden', position: 'relative' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hover ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)',
          opacity: hover ? 1 : 0, transition: 'opacity 0.3s',
        }} />
        {product.category && (
          <span style={{
            position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)', color: '#1d1d1f', fontSize: 11, fontWeight: 600,
            padding: '4px 10px', borderRadius: 100,
          }}>{product.category}</span>
        )}
      </div>

      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1d1d1f', lineHeight: 1.3 }}>{product.name}</h3>
        <p style={{
          margin: 0, fontSize: 13, color: '#6e6e73', lineHeight: 1.5, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1d1d1f' }}>{fmtPrice(product.price)}</span>
          <button onClick={handleAdd} style={{
            background: added ? '#34c759' : '#0071e3', color: '#fff', border: 'none',
            borderRadius: 100, padding: '8px 18px', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.25s, transform 0.15s',
            transform: added ? 'scale(0.96)' : 'scale(1)',
          }}>{added ? '✓ Đã thêm' : '+ Giỏ hàng'}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function HomePage({ products, loading, onAddCart }) {
  const navigate = useNavigate();
  const featured = products.slice(0, 3);

  const cats = [
    { icon: '📱', name: 'iPhone', desc: 'Smartphone cao cấp' },
    { icon: '💻', name: 'Mac', desc: 'Laptop & Desktop' },
    { icon: '📋', name: 'iPad', desc: 'Máy tính bảng' },
    { icon: '⌚', name: 'Watch', desc: 'Đồng hồ thông minh' },
    { icon: '🎵', name: 'Audio', desc: 'Tai nghe & Loa' },
    { icon: '🤖', name: 'Android', desc: 'Android cao cấp' },
  ];

  return (
    <div style={{ paddingTop: 52 }}>
      {/* HERO */}
      <section style={{
        minHeight: '92vh', background: 'linear-gradient(160deg, #1d1d1f 0%, #2d2d30 50%, #1a1a2e 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '15%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(0,113,227,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(94,92,230,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)', transform: 'translate(-50%,-50%)', borderRadius: '50%' }} />
        </div>

        <div style={{ animation: 'fadeUp 0.9s ease both', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, color: '#0071e3', textTransform: 'uppercase', display: 'block', marginBottom: 24 }}>
            Công nghệ đỉnh cao
          </span>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 82px)', fontWeight: 800, color: '#f5f5f7', margin: '0 0 24px', lineHeight: 1.04, letterSpacing: -2.5, maxWidth: 820 }}>
            Công nghệ.<br />
            <span style={{ background: 'linear-gradient(135deg, #0071e3 0%, #5e5ce6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Đẳng cấp.
            </span>
          </h1>
          <p style={{ fontSize: 20, color: '#a1a1a6', margin: '0 0 52px', maxWidth: 520, lineHeight: 1.65 }}>
            Khám phá bộ sưu tập thiết bị công nghệ cao cấp nhất.<br />
            Hàng chính hãng, bảo hành toàn quốc.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/products')} style={{
              background: '#0071e3', color: '#fff', border: 'none', borderRadius: 100,
              padding: '16px 40px', fontSize: 17, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(0,113,227,0.4)',
            }}
              onMouseEnter={e => { e.target.style.background = '#0077ed'; e.target.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.target.style.background = '#0071e3'; e.target.style.transform = 'scale(1)'; }}
            >Mua sắm ngay</button>
            <button onClick={() => navigate('/chat')} style={{
              background: 'rgba(255,255,255,0.1)', color: '#f5f5f7',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 100,
              padding: '16px 36px', fontSize: 17, cursor: 'pointer', fontFamily: 'inherit',
              backdropFilter: 'blur(8px)', transition: 'all 0.2s',
            }}>Tư vấn AI ✨</button>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite', color: '#6e6e73', fontSize: 12, letterSpacing: 1 }}>
          ↓ CUỘN ĐỂ KHÁM PHÁ
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ background: '#f5f5f7', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={S.sectionTitle}>Danh mục sản phẩm</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
            {cats.map(c => (
              <div key={c.name} onClick={() => navigate(`/products?cat=${c.name}`)}
                style={{ background: '#fff', borderRadius: 18, padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ fontSize: 34, marginBottom: 12 }}>{c.icon}</div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1d1d1f' }}>{c.name}</p>
                <p style={{ margin: '5px 0 0', fontSize: 11, color: '#6e6e73' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ background: '#fff', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
            <h2 style={{ ...S.sectionTitle, margin: 0 }}>Sản phẩm nổi bật</h2>
            <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', color: '#0071e3', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Xem tất cả →</button>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ background: '#f5f5f7', borderRadius: 20, height: 380, animation: 'pulse 1.5s infinite' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {featured.map(p => <ProductCard key={p.id} product={p} onAddCart={onAddCart} />)}
            </div>
          )}
        </div>
      </section>

      {/* PROMO DARK */}
      <section style={{ background: '#1d1d1f', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, color: '#0071e3', textTransform: 'uppercase', marginBottom: 20 }}>Ưu đãi đặc biệt</p>
          <h2 style={{ fontSize: 52, fontWeight: 800, color: '#f5f5f7', margin: '0 0 20px', letterSpacing: -1.5, lineHeight: 1.08 }}>
            Trả góp 0%<br />lên đến 24 tháng
          </h2>
          <p style={{ fontSize: 18, color: '#a1a1a6', margin: '0 0 44px', lineHeight: 1.65 }}>
            Sở hữu ngay thiết bị mơ ước với lãi suất 0%.<br />Miễn phí vận chuyển toàn quốc cho mọi đơn hàng.
          </p>
          <button onClick={() => navigate('/products')} style={{
            background: '#fff', color: '#1d1d1f', border: 'none', borderRadius: 100,
            padding: '16px 40px', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>Khám phá ngay</button>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ background: '#f5f5f7', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={S.sectionTitle}>Tại sao chọn TechShop?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              { icon: '🛡️', title: 'Hàng chính hãng 100%', desc: 'Cam kết sản phẩm chính hãng, có tem bảo hành đầy đủ, hóa đơn VAT' },
              { icon: '🚚', title: 'Giao hàng siêu tốc', desc: 'Giao trong 2 giờ tại nội thành TP.HCM & HN, 1-2 ngày toàn quốc' },
              { icon: '↩️', title: 'Đổi trả 30 ngày', desc: 'Không hài lòng? Đổi trả trong 30 ngày không cần lý do, hoàn tiền 100%' },
              { icon: '🤝', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 38, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6e6e73', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section style={{ background: '#fff', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={S.sectionTitle}>Tất cả sản phẩm</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {(loading ? [1,2,3,4,5,6] : products).map((p, i) =>
              loading
                ? <div key={i} style={{ background: '#f5f5f7', borderRadius: 20, height: 380, animation: 'pulse 1.5s infinite' }} />
                : <ProductCard key={p.id} product={p} onAddCart={onAddCart} />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ============================================================
   PRODUCTS PAGE
   ============================================================ */
function ProductsPage({ products, loading, onAddCart }) {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Tất cả');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    const p = new URLSearchParams(location.search).get('cat');
    if (p) setActiveCat(p);
  }, [location.search]);

  let filtered = products.filter(p => {
    const mc = activeCat === 'Tất cả' || p.category === activeCat;
    const ms = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });
  if (sort === 'asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div style={{ paddingTop: 52, minHeight: '100vh', background: '#f5f5f7' }}>
      <div style={{ background: '#fff', padding: '48px 40px 36px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: '#1d1d1f', margin: '0 0 6px', letterSpacing: -1 }}>Sản phẩm</h1>
          <p style={{ fontSize: 15, color: '#6e6e73', margin: '0 0 28px' }}>{filtered.length} sản phẩm</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', fontSize: 15 }}>🔍</span>
              <input type="text" placeholder="Tìm kiếm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...S.formInput, paddingLeft: 40, background: '#f5f5f7', border: '1px solid transparent' }}
                onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#0071e3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.15)'; }}
                onBlur={e => { e.target.style.background = '#f5f5f7'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '11px 16px', border: '1px solid #d2d2d7', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1d1d1f', outline: 'none', cursor: 'pointer' }}>
              <option value="default">Mặc định</option>
              <option value="asc">Giá thấp → cao</option>
              <option value="desc">Giá cao → thấp</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 40px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              background: activeCat === cat ? '#0071e3' : '#fff', color: activeCat === cat ? '#fff' : '#1d1d1f',
              border: activeCat === cat ? 'none' : '1px solid #d2d2d7', borderRadius: 100,
              padding: '8px 20px', fontSize: 14, fontWeight: activeCat === cat ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: '#fff', borderRadius: 20, height: 380, animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6e6e73' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>Không tìm thấy sản phẩm</p>
            <p style={{ fontSize: 14 }}>Thử từ khóa khác hoặc chọn danh mục khác</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onAddCart={onAddCart} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

/* ============================================================
   LOGIN PAGE
   ============================================================ */
function LoginPage({ addToast }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      addToast('Đăng nhập thành công!', 'success');
      navigate('/');
    } catch { setErr('Tên đăng nhập hoặc mật khẩu không đúng'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1d1d1f', margin: '0 0 8px', letterSpacing: -0.5 }}>Chào mừng trở lại</h1>
          <p style={{ fontSize: 15, color: '#6e6e73' }}>Đăng nhập vào TechShop</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={S.labelStyle}>Tên đăng nhập</label>
            <input type="text" required placeholder="Nhập tên đăng nhập" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} style={S.formInput}
              onFocus={e => { e.target.style.borderColor = '#0071e3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = '#d2d2d7'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={S.labelStyle}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} required placeholder="Nhập mật khẩu" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} style={{ ...S.formInput, paddingRight: 44 }}
                onFocus={e => { e.target.style.borderColor = '#0071e3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#d2d2d7'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#8e8e93' }}>{showPw ? '🙈' : '👁️'}</button>
            </div>
          </div>
          {err && <p style={{ color: '#ff3b30', fontSize: 13, textAlign: 'center', fontWeight: 500 }}>⚠️ {err}</p>}
          <button type="submit" disabled={loading} style={{ ...S.primaryBtnFull, marginTop: 8, height: 46, fontSize: 16, background: loading ? '#d2d2d7' : '#0071e3' }}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#6e6e73', marginTop: 24 }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#0071e3', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   REGISTER PAGE
   ============================================================ */
function RegisterPage({ addToast }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = 'Tối thiểu 3 ký tự';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (form.password.length < 8) e.password = 'Tối thiểu 8 ký tự';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, form);
      addToast('Đăng ký thành công! Đang chuyển hướng...', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) { addToast(err.response?.data || 'Tên đăng nhập hoặc email đã tồn tại', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1d1d1f', margin: '0 0 8px', letterSpacing: -0.5 }}>Tạo tài khoản</h1>
          <p style={{ fontSize: 15, color: '#6e6e73' }}>Tham gia cộng đồng TechShop</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'username', label: 'Tên đăng nhập', type: 'text', ph: 'Chọn tên đăng nhập' },
            { key: 'email', label: 'Email', type: 'email', ph: 'example@email.com' },
            { key: 'password', label: 'Mật khẩu', type: 'password', ph: 'Tối thiểu 8 ký tự' },
          ].map(f => (
            <div key={f.key}>
              <label style={S.labelStyle}>{f.label}</label>
              <input type={f.type} required placeholder={f.ph} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ ...S.formInput, borderColor: errors[f.key] ? '#ff3b30' : '#d2d2d7' }}
                onFocus={e => { e.target.style.borderColor = '#0071e3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = errors[f.key] ? '#ff3b30' : '#d2d2d7'; e.target.style.boxShadow = 'none'; }}
              />
              {errors[f.key] && <p style={{ color: '#ff3b30', fontSize: 12, margin: '4px 0 0' }}>{errors[f.key]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ ...S.primaryBtnFull, marginTop: 8, height: 46, fontSize: 16, background: loading ? '#d2d2d7' : '#0071e3' }}>
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#6e6e73', marginTop: 24 }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#0071e3', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   CHECKOUT PAGE
   ============================================================ */
function CheckoutPage({ cart, updateQty, removeItem, total, clearCart, addToast }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ name: '', phone: '', address: '', note: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!localStorage.getItem('token')) navigate('/login'); }, []);

  const handleOrder = async () => {
    if (!info.name || !info.phone || !info.address) { addToast('Vui lòng điền đầy đủ thông tin giao hàng', 'warning'); return; }
    setLoading(true);
    try {
      const payload = { orderLineItemsDtoList: cart.map(i => ({ skuCode: i.skuCode || i.id, price: i.price, quantity: i.qty })) };
      await apiFetch.post('/order', payload);
    } catch (err) {
      if (err.response?.status === 401) { navigate('/login'); return; }
      // Demo: vẫn cho xem thành công nếu BE lỗi
    } finally {
      setLoading(false);
      clearCart();
      setStep(3);
    }
  };

  if (step === 3) return (
    <div style={{ minHeight: '100vh', paddingTop: 52, background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '64px 56px', textAlign: 'center', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1d1d1f', margin: '0 0 14px', letterSpacing: -0.5 }}>Đặt hàng thành công!</h2>
        <p style={{ fontSize: 16, color: '#6e6e73', margin: '0 0 40px', lineHeight: 1.65 }}>
          Cảm ơn bạn đã tin tưởng TechShop!<br />
          Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.
        </p>
        <button onClick={() => navigate('/')} style={{ ...S.primaryBtnFull, height: 48, fontSize: 16 }}>Tiếp tục mua sắm</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: 52, background: '#f5f5f7' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          {['Giỏ hàng', 'Thông tin giao hàng'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: i + 1 < step ? 'pointer' : 'default' }} onClick={() => { if (i + 1 < step) setStep(i + 1); }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i + 1 ? '#34c759' : step === i + 1 ? '#0071e3' : '#d2d2d7', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? '#1d1d1f' : '#8e8e93' }}>{s}</span>
              </div>
              {i < 1 && <div style={{ flex: 1, maxWidth: 60, height: 2, background: step > 1 ? '#0071e3' : '#d2d2d7', borderRadius: 2 }} />}
            </React.Fragment>
          ))}
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f', margin: '0 0 12px' }}>Giỏ hàng trống</h2>
            <p style={{ color: '#6e6e73', marginBottom: 32 }}>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
            <button onClick={() => navigate('/products')} style={{ ...S.primaryBtnFull, maxWidth: 200, height: 46, margin: '0 auto' }}>Mua sắm ngay</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 28 }}>
            {/* Left */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              {step === 1 ? (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1d1d1f', margin: '0 0 24px' }}>Giỏ hàng ({cart.length} sản phẩm)</h2>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: 16, paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid #f5f5f7', alignItems: 'center' }}>
                      <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', background: '#f5f5f7', flexShrink: 0 }}>
                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0071e3' }}>{fmtPrice(item.price)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)} style={S.qtyBtn}>−</button>
                        <span style={{ fontSize: 15, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} style={S.qtyBtn}>+</button>
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', marginLeft: 8 }}>Xóa</button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1d1d1f', margin: '0 0 24px' }}>Thông tin giao hàng</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { key: 'name', label: 'Họ và tên *', type: 'text', ph: 'Nguyễn Văn A' },
                      { key: 'phone', label: 'Số điện thoại *', type: 'tel', ph: '0901 234 567' },
                      { key: 'address', label: 'Địa chỉ giao hàng *', type: 'text', ph: '123 Đường ABC, Quận 1, TP.HCM' },
                      { key: 'note', label: 'Ghi chú (tùy chọn)', type: 'text', ph: 'Giao giờ hành chính, gọi trước khi giao...' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={S.labelStyle}>{f.label}</label>
                        <input type={f.type} placeholder={f.ph} value={info[f.key]}
                          onChange={e => setInfo({ ...info, [f.key]: e.target.value })} style={S.formInput}
                          onFocus={e => { e.target.style.borderColor = '#0071e3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.15)'; }}
                          onBlur={e => { e.target.style.borderColor = '#d2d2d7'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right - Summary */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', alignSelf: 'start', position: 'sticky', top: 72 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1d1d1f', margin: '0 0 20px' }}>Tóm tắt đơn hàng</h3>
              {cart.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: '#6e6e73', flex: 1, marginRight: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name} × {i.qty}</span>
                  <span style={{ fontWeight: 600, color: '#1d1d1f', whiteSpace: 'nowrap' }}>{fmtPrice(i.price * i.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 16, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#6e6e73' }}>
                  <span>Tạm tính</span><span>{fmtPrice(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#34c759' }}>
                  <span>Vận chuyển</span><span style={{ fontWeight: 600 }}>Miễn phí</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #f0f0f0', marginTop: 10 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#1d1d1f' }}>Tổng cộng</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#0071e3' }}>{fmtPrice(total)}</span>
                </div>
              </div>

              {step === 1 ? (
                <button onClick={() => setStep(2)} style={{ ...S.primaryBtnFull, marginTop: 20, height: 48, fontSize: 16 }}>
                  Tiếp tục nhập thông tin →
                </button>
              ) : (
                <>
                  <button onClick={handleOrder} disabled={loading} style={{ ...S.primaryBtnFull, marginTop: 20, height: 48, fontSize: 16, background: loading ? '#d2d2d7' : '#0071e3' }}>
                    {loading ? 'Đang xử lý...' : '✓ Xác nhận đặt hàng'}
                  </button>
                  <button onClick={() => setStep(1)} style={{ ...S.primaryBtnFull, marginTop: 10, height: 44, fontSize: 15, background: 'transparent', color: '#1d1d1f', border: '1px solid #d2d2d7' }}>
                    ← Quay lại giỏ hàng
                  </button>
                </>
              )}
              <p style={{ fontSize: 11, color: '#8e8e93', textAlign: 'center', marginTop: 14 }}>🔒 Bảo mật SSL • Đổi trả 30 ngày</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

/* ============================================================
   CHAT PAGE
   ============================================================ */
function ChatPage() {
  const [msgs, setMsgs] = useState([
    { role: 'ai', text: 'Xin chào! 👋 Tôi là trợ lý AI của TechShop. Tôi có thể giúp bạn tìm sản phẩm phù hợp, so sánh cấu hình, hoặc tư vấn về công nghệ. Bạn cần hỗ trợ gì?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const quickQs = ['iPhone 15 Pro có gì mới?', 'Nên mua MacBook hay PC?', 'Tai nghe chống ồn tốt nhất?', 'So sánh iPhone và Samsung'];

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMsgs(p => [...p, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/chatbot/ask`, { message: msg });
      const reply = res.data?.reply || res.data?.response || res.data?.message || 'Cảm ơn câu hỏi của bạn!';
      setMsgs(p => [...p, { role: 'ai', text: reply }]);
    } catch {
      setMsgs(p => [...p, { role: 'ai', text: 'Xin lỗi, hệ thống AI hiện đang bận. Vui lòng thử lại sau hoặc liên hệ hotline 1800-TECH để được hỗ trợ trực tiếp.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: 52, height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f7' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#0071e3,#5e5ce6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#1d1d1f' }}>TechShop AI</p>
          <p style={{ margin: 0, fontSize: 12, color: '#34c759' }}>● Online • Phản hồi ngay lập tức</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 820, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
            {m.role === 'ai' && <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#0071e3,#5e5ce6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, alignSelf: 'flex-end' }}>🤖</div>}
            <div style={{
              maxWidth: '72%', padding: '12px 18px',
              borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: m.role === 'user' ? '#0071e3' : '#fff',
              color: m.role === 'user' ? '#fff' : '#1d1d1f',
              fontSize: 15, lineHeight: 1.55, boxShadow: m.role === 'ai' ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#0071e3,#5e5ce6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
            <div style={{ background: '#fff', padding: '14px 18px', borderRadius: '20px 20px 20px 4px', display: 'flex', gap: 5, alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              {[0, 1, 2].map(n => <div key={n} style={{ width: 7, height: 7, background: '#8e8e93', borderRadius: '50%', animation: `bounce 1.2s infinite ${n * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {msgs.length === 1 && (
        <div style={{ padding: '0 24px 12px', display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 820, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {quickQs.map(q => (
            <button key={q} onClick={() => send(q)} style={{ background: '#fff', border: '1px solid #d2d2d7', borderRadius: 100, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#0071e3', fontWeight: 500 }}>{q}</button>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '14px 24px', display: 'flex', gap: 10, maxWidth: 820, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <input type="text" placeholder="Hỏi về sản phẩm, so sánh, tư vấn..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          style={{ flex: 1, padding: '13px 18px', border: '1px solid #d2d2d7', borderRadius: 100, fontSize: 15, fontFamily: 'inherit', outline: 'none', background: '#f5f5f7' }}
          onFocus={e => { e.target.style.borderColor = '#0071e3'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = '#d2d2d7'; e.target.style.background = '#f5f5f7'; e.target.style.boxShadow = 'none'; }}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          background: (loading || !input.trim()) ? '#d2d2d7' : '#0071e3', color: '#fff',
          border: 'none', borderRadius: 100, padding: '13px 24px', fontSize: 15, fontWeight: 600,
          cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
        }}>Gửi ↑</button>
      </div>
    </div>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer style={{ background: '#1d1d1f', color: '#6e6e73', padding: '52px 40px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <h3 style={{ color: '#f5f5f7', fontSize: 18, fontWeight: 800, margin: '0 0 14px', letterSpacing: -0.5 }}>⚡ TechShop</h3>
            <p style={{ fontSize: 13, lineHeight: 1.75, margin: '0 0 20px' }}>Nơi hội tụ của công nghệ đỉnh cao. Hàng chính hãng, giá tốt nhất, dịch vụ tận tâm.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['📘 Facebook', '📸 Instagram', '🐦 Twitter'].map(s => (
                <span key={s} style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 100, cursor: 'pointer' }}>{s}</span>
              ))}
            </div>
          </div>
          {[
            { title: 'Sản phẩm', links: ['iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods'] },
            { title: 'Hỗ trợ', links: ['Hướng dẫn mua', 'Đổi trả', 'Bảo hành', 'Liên hệ', 'FAQ'] },
            { title: 'Công ty', links: ['Về chúng tôi', 'Tuyển dụng', 'Tin tức', 'Đối tác'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color: '#f5f5f7', fontSize: 12, fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1 }}>{col.title}</h4>
              {col.links.map(l => (
                <p key={l} style={{ fontSize: 13, margin: '0 0 10px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#f5f5f7'}
                  onMouseLeave={e => e.target.style.color = '#6e6e73'}
                >{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, flexWrap: 'wrap', gap: 12 }}>
          <span>© 2025 TechShop. Tất cả quyền được bảo lưu.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>🔒 SSL Bảo mật</span>
            <span>📦 Giao hàng toàn quốc</span>
            <span>↩️ Đổi trả 30 ngày</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const { toasts, add: addToast } = useToast();
  const { cart, addItem, removeItem, updateQty, clearCart, total, count } = useCart();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/product`)
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          const enriched = r.data.map((p, i) => ({
            ...p,
            skuCode: p.skuCode || p.name?.toLowerCase().replace(/\s+/g, '_') || p.id,
            category: p.category || MOCK_PRODUCTS[i % MOCK_PRODUCTS.length]?.category || 'Khác',
            imageUrl: p.imageUrl || MOCK_PRODUCTS[i % MOCK_PRODUCTS.length]?.imageUrl,
          }));
          setProducts(enriched);
        }
        // Nếu BE trả rỗng hoặc lỗi → dùng MOCK_PRODUCTS (đã set mặc định)
      })
      .catch(() => { /* Dùng mock data bình thường, không hiện lỗi */ })
      .finally(() => setLoading(false));
  }, []);

  const handleAddCart = (product) => {
    addItem(product);
    addToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
  };

  const handleCheckout = () => {
    setCartOpen(false);
    window.location.href = '/checkout';
  };

  return (
    <BrowserRouter>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f7; color: #1d1d1f; -webkit-font-smoothing: antialiased; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c7c7cc; border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0) scale(0.85); opacity: 0.5; } 40% { transform: translateY(-7px) scale(1.1); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>

      <ToastContainer toasts={toasts} />
      <Navbar cartCount={count} onCartClick={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} total={total} onCheckout={handleCheckout} />

      <Routes>
        <Route path="/" element={<HomePage products={products} loading={loading} onAddCart={handleAddCart} />} />
        <Route path="/products" element={<ProductsPage products={products} loading={loading} onAddCart={handleAddCart} />} />
        <Route path="/login" element={<LoginPage addToast={addToast} />} />
        <Route path="/register" element={<RegisterPage addToast={addToast} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} updateQty={updateQty} removeItem={removeItem} total={total} clearCart={clearCart} addToast={addToast} />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}