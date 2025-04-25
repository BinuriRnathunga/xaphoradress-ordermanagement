import React, { useState } from 'react';
import './ProductSelector.css';

function ProductSelector({ products, onSelectProduct, selectedProduct }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-selector">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          filteredProducts.map(product => (
            <div 
              key={product._id}
              className={`product-card ${selectedProduct && selectedProduct._id === product._id ? 'selected' : ''}`}
              onClick={() => onSelectProduct(product)}
            >
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-stock">In stock: {product.stockQuantity}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductSelector;