import React, { useState, useEffect } from 'react';
import OrderList from '../components/OrderList';
import OrderForm from '../components/OrderForm';
import OrderDetail from '../components/OrderDetail';
import './OrderDashboard.css';

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'detail'

  // Fetch all orders
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8070/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single order
  const fetchOrder = async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8070/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      setSelectedOrder(data);
      setView('detail');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching order details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8070/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      fetchOrders(); // Refresh orders list
      setView('list');
    } catch (err) {
      setError(err.message);
      console.error('Error creating order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing order
  const updateOrder = async (orderId, orderData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8070/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const data = await response.json();
      fetchOrders(); // Refresh orders list
      setSelectedOrder(data.order);
      setView('detail');
    } catch (err) {
      setError(err.message);
      console.error('Error updating order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8070/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      fetchOrders(); // Refresh orders list
      setSelectedOrder(null);
      setView('list');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to order
  const addItemToOrder = async (orderId, itemData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8070/api/orders/${orderId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to order');
      }

      const data = await response.json();
      fetchOrder(orderId); // Refresh order details
    } catch (err) {
      setError(err.message);
      console.error('Error adding item to order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from order
  const removeItemFromOrder = async (orderId, itemId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8070/api/orders/${orderId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from order');
      }

      fetchOrder(orderId); // Refresh order details
    } catch (err) {
      setError(err.message);
      console.error('Error removing item from order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (orderId) => {
    fetchOrder(orderId);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setView('edit');
  };

  const handleCreateOrderClick = () => {
    setSelectedOrder(null);
    setView('create');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedOrder(null);
  };

  return (
    <div className="order-dashboard">
      <h1>Order Management Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-controls">
        {view === 'list' && (
          <button className="btn-create" onClick={handleCreateOrderClick}>
            Create New Order
          </button>
        )}
        
        {view !== 'list' && (
          <button className="btn-back" onClick={handleBackToList}>
            Back to Orders List
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {view === 'list' && (
            <OrderList 
              orders={orders} 
              onViewOrder={handleViewOrder} 
              onEditOrder={handleEditOrder} 
              onDeleteOrder={deleteOrder} 
            />
          )}

          {view === 'create' && (
            <OrderForm 
              onSubmit={createOrder} 
              isLoading={isLoading} 
            />
          )}

          {view === 'edit' && selectedOrder && (
            <OrderForm 
              order={selectedOrder} 
              onSubmit={(orderData) => updateOrder(selectedOrder._id, orderData)} 
              isLoading={isLoading} 
            />
          )}

          {view === 'detail' && selectedOrder && (
            <OrderDetail 
              order={selectedOrder} 
              onEdit={() => handleEditOrder(selectedOrder)} 
              onDelete={() => deleteOrder(selectedOrder._id)} 
              onAddItem={(itemData) => addItemToOrder(selectedOrder._id, itemData)} 
              onRemoveItem={(itemId) => removeItemFromOrder(selectedOrder._id, itemId)} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrderDashboard;