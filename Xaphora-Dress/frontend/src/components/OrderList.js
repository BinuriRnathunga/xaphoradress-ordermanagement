import React from 'react';
import './OrderList.css';

function OrderList({ orders, onViewOrder, onEditOrder, onDeleteOrder }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Ordered':
        return 'status-ordered';
      case 'Packed':
        return 'status-packed';
      case 'Shipped':
        return 'status-shipped';
      case 'Delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  const getPaymentStatusClass = (paymentStatus) => {
    switch (paymentStatus) {
      case 'pending':
        return 'payment-pending';
      case 'completed':
        return 'payment-completed';
      case 'failed':
        return 'payment-failed';
      default:
        return '';
    }
  };

  return (
    <div className="order-list">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerName}</td>
                <td>{formatDate(order.placedDate)}</td>
                <td>{order.items.length}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`payment-badge ${getPaymentStatusClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="btn-view" 
                    onClick={() => onViewOrder(order._id)}
                    title="View Order"
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  <button 
                    className="btn-edit" 
                    onClick={() => onEditOrder(order)}
                    title="Edit Order"
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => onDeleteOrder(order._id)}
                    title="Delete Order"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;