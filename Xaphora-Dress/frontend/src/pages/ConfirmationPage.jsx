// src/pages/ConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import './ConfirmationPage.css';

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const navigate   = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(r => r.json())
      .then(setOrder)
      .catch(console.error);
  }, [orderId]);

  if (!order) return <p>Loading…</p>;

  return (
    <div className="confirmation-page">
      <h1>Thank you! Order #{order.id}</h1>

      <section>
        <h2>Shipping Address</h2>
        <p>{order.shippingAddress.line1}</p>
        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
        <p>{order.shippingAddress.country}</p>
      </section>

      <section>
        <h2>Items</h2>
        <ul>
          {order.items.map(i => (
            <li key={i.productId}>
              {i.name} × {i.qty} — ${(i.price * i.qty).toFixed(2)}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Payment</h2>
        <p>Points Redeemed: {order.pointsRedeemed}</p>
        <p><strong>Amount Charged:</strong> ${order.totalAmount.toFixed(2)}</p>
      </section>

      <button onClick={() => navigate('/cart')}>
        Back to Cart
      </button>
    </div>
  );
}
