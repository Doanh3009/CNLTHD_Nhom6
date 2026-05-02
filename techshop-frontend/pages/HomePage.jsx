import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/product').then(res => setProducts(res.data)).catch(() => {});
  }, []);

  return (
    <div className="py-16">
      <h2 className="text-[32px] font-bold text-heading mb-12">Sản phẩm mới nhất</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

export default HomePage;