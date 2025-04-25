// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8070/api/orders/products/all')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error loading products', err));
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existing = updatedCart.find(item => item.productId === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({
        productId: product._id,
        productName: product.name,
        quantity: 1,
        price: product.price
      });
    }

    setCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Cart</h2>

      <h3>Available Products</h3>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} - LKR {product.price.toFixed(2)}
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <h3>Your Cart</h3>
      {cart.length === 0 ? <p>No items in cart</p> : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>LKR {item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>LKR {(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4>Total: LKR {total.toFixed(2)}</h4>

      <button onClick={() => navigate('/checkout')} disabled={cart.length === 0}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPage;
