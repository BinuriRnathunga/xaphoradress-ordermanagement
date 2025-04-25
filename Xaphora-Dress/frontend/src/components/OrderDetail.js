import React, { useState } from 'react';
import ProductSelector from './ProductSelector';
import './OrderDetail.css';

function OrderDetail({ order, onEdit, onDelete, onAddItem, onRemoveItem }) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get status class for styling
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

  // Get payment status class for styling
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

  // Fetch products when adding a new item
  const handleAddItemClick = async () => {
    try {
      const response = await fetch('http://localhost:8070/api/orders/products/all');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setIsAddingItem(true);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;

    onAddItem({
      productId: selectedProduct._id,
      quantity: quantity,
      price: selectedProduct.price
    });

    // Reset
    setSelectedProduct(null);
    setQuantity(1);
    setIsAddingItem(false);
  };

  return (
    <div className="order-detail">
      <div className="order-header">
        <h2>Order Details</h2>
        <div className="order-actions">
          <button className="btn-edit" onClick={onEdit}>Edit Order</button>
          <button className="btn-delete" onClick={onDelete}>Delete Order</button>
        </div>
      </div>

      <div className="order-info">
        <div className="order-section">
          <h3>Basic Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <th>Order ID:</th>
                <td>{order._id}</td>
              </tr>
              <tr>
                <th>Customer:</th>
                <td>{order.customerName}</td>
              </tr>
              <tr>
                <th>Shipping Address:</th>
                <td>{order.shippingAddress}</td>
              </tr>
              <tr>
                <th>Order Date:</th>
                <td>{formatDate(order.placedDate)}</td>
              </tr>
              <tr>
                <th>Total Amount:</th>
                <td className="total-amount">${order.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Payment Status:</th>
                <td>
                  <span className={`payment-badge ${getPaymentStatusClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="order-section">
          <div className="items-header">
            <h3>Order Items</h3>
            <button className="btn-add-item" onClick={handleAddItemClick}>
              Add Item
            </button>
          </div>

          {order.items.length === 0 ? (
            <p className="no-items">No items in this order.</p>
          ) : (
            <table className="items-table">
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
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.productName}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="total-label">Total:</td>
                  <td colSpan="2" className="total-amount">${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {isAddingItem && (
            <div className="add-item-form">
              <h4>Add Product to Order</h4>
              <div className="product-selection">
                <ProductSelector 
                  products={products} 
                  onSelectProduct={handleProductSelect} 
                  selectedProduct={selectedProduct}
                />
                
                {selectedProduct && (
                  <div className="quantity-selection">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                    
                    <div className="item-actions">
                      <button 
                        className="btn-confirm-add" 
                        onClick={handleAddItem}
                      >
                        Add to Order
                      </button>
                      <button 
                        className="btn-cancel-add" 
                        onClick={() => setIsAddingItem(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;