import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
      
      {/* Product Image with Scrim */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <img 
          src={product?.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop"} 
          alt="Phone" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient Scrim - Đệm đen để chữ trắng nổi lên (nếu có nhãn đè lên ảnh) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <p className="text-white font-medium truncate">{product?.name || "iPhone 15 Pro Max"}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-heading font-bold text-lg mb-1 truncate">{product?.name || "iPhone 15 Pro Max"}</h3>
        <p className="text-body text-sm mb-4 line-clamp-2">Siêu phẩm công nghệ mới nhất với chip A17 Pro mạnh mẽ.</p>
        
        <div className="flex items-center justify-between">
          <span className="text-heading font-bold text-xl">29.990.000đ</span>
          {/* Pill Button cho hành động thêm vào giỏ */}
          <button className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;