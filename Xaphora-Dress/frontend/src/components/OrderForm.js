import React, { useState, useEffect } from 'react';
import ProductSelector from './ProductSelector';
import './OrderForm.css';

function OrderForm({ order, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    userId: order ? order.userId : 'user1', // Hardcoded user ID
    customerName: order ? order.customerName : '',
    shippingAddress: order ? order.shippingAddress : '',
    items: order ? [...order.items] : [],
    paymentStatus: order ? order.paymentStatus : 'pending',
    status: order ? order.status : 'Ordered'
  });

  const [totalAmount, setTotalAmount] = useState(order ? order.totalAmount : 0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Fetch products for the product selector
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8070/api/orders/products/all');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Recalculate total whenever items change
  useEffect(() => {
    const newTotal = formData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    setTotalAmount(newTotal);
  }, [formData.items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;

    const newItem = {
      _id: Date.now().toString(), // Temporary ID for new items
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      quantity: quantity,
      price: selectedProduct.price
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });

    // Reset selection
    setSelectedProduct(null);
    setQuantity(1);
    setIsAddingItem(false);
  };

  const handleRemoveItem = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item._id !== itemId)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add total amount to the form data
    onSubmit({ ...formData, totalAmount });
  };

  return (
    <div className="order-form">
      <h2>{order ? 'Edit Order' : 'Create New Order'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="shippingAddress">Shipping Address</label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            required
          />
        </div>

        {order && (
          <>
            <div className="form-group">
              <label htmlFor="paymentStatus">Payment Status</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Order Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Ordered">Ordered</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </>
        )}

        <div className="order-items">
          <h3>Order Items</h3>
          
          {formData.items.length === 0 ? (
            <p className="no-items">No items added to this order yet.</p>
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
                {formData.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.productName}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => handleRemoveItem(item._id)}
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
                  <td colSpan="2" className="total-amount">${totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {!isAddingItem ? (
            <button
              type="button"
              className="btn-add-item"
              onClick={() => setIsAddingItem(true)}
            >
              Add Item
            </button>
          ) : (
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
                        type="button" 
                        className="btn-confirm-add" 
                        onClick={handleAddItem}
                      >
                        Add to Order
                      </button>
                      <button 
                        type="button" 
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

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isLoading || formData.items.length === 0}
          >
            {isLoading ? 'Processing...' : (order ? 'Update Order' : 'Create Order')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;