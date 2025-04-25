// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyUser = {
  id: 'user1',
  loyaltyPoints: 300 // 300 points = LKR 300
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState({});
  const [usePoints, setUsePoints] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const storedDetails = JSON.parse(localStorage.getItem('checkoutDetails')) || {};
    setCart(storedCart);
    setCheckoutDetails(storedDetails);
  }, []);

  useEffect(() => {
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = usePoints ? Math.min(dummyUser.loyaltyPoints, cartTotal) : 0;
    setFinalTotal(cartTotal - discount);
  }, [cart, usePoints]);

  const handlePayment = () => {
    const order = {
      userId: dummyUser.id,
      customerName: checkoutDetails.customerName,
      shippingAddress: checkoutDetails.shippingAddress,
      items: cart,
      totalAmount: finalTotal,
      status: 'Ordered',
      paymentStatus: 'completed',
      placedDate: new Date().toISOString(),
      pointsUsed: usePoints ? Math.min(dummyUser.loyaltyPoints, finalTotal) : 0
    };

    // Simulate backend save
    localStorage.setItem('latestOrder', JSON.stringify(order));

    // Reset cart + details
    localStorage.removeItem('cart');
    localStorage.removeItem('checkoutDetails');

    // Redirect to summary
    navigate('/order-summary');
  };

  return (
    <div className="payment-page">
      <h2>Payment</h2>

      <p><strong>Customer:</strong> {checkoutDetails.customerName}</p>
      <p><strong>Shipping To:</strong> {checkoutDetails.shippingAddress}</p>
      <p><strong>Cart Total:</strong> LKR {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>

      <div>
        <label>
          <input
            type="checkbox"
            checked={usePoints}
            onChange={() => setUsePoints(!usePoints)}
          /> Use Loyalty Points (Available: {dummyUser.loyaltyPoints})
        </label>
      </div>

      <h4>Final Payable: LKR {finalTotal.toFixed(2)}</h4>

      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
