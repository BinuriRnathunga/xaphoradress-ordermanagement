// controllers/orderController.js

// Mock data (hardcoded for now)
let orders = [
    {
      _id: "order1",
      userId: "user1",
      customerName: "John Doe",
      shippingAddress: "123 Main St, City, Country",
      items: [
        {
          _id: "item1",
          productId: "product1",
          productName: "Bohemian croptop",
          quantity: 1,
          price: 10
        },
        {
          _id: "item2",
          productId: "product2",
          productName: "rib croptop",
          quantity: 2,
          price: 12
        }
      ],
      totalAmount: 34,
      paymentStatus: "completed",
      status: "Shipped",
      placedDate: new Date("2023-10-15"),
      createdAt: new Date("2023-10-15")
    },
    {
      _id: "order2",
      userId: "user2",
      customerName: "Jane Smith",
      shippingAddress: "456 Oak Ave, Town, Country",
      items: [
        {
          _id: "item3",
          productId: "product3",
          productName: "flaired pant",
          quantity: 1,
          price: 15.99
        }
      ],
      totalAmount: 15.99,
      paymentStatus: "pending",
      status: "Ordered",
      placedDate: new Date("2023-10-20"),
      createdAt: new Date("2023-10-20")
    }
  ];
  
  // Mock products data
  const products = [
    {
      _id: "product1",
      name: "tight frock",
      category: "frocks",
      price: 17,
      stockQuantity: 50,
      imageUrl: "https://via.placeholder.com/150",
      description: "good material"
    },
    {
      _id: "product2",
      name: "rib croptop",
      category: "tops",
      price: 15,
      stockQuantity: 100,
      imageUrl: "https://via.placeholder.com/150",
      description: "comfortable"
    },
    {
      _id: "product3",
      name: "tight skirt",
      category: "skirts",
      price: 16,
      stockQuantity: 25,
      imageUrl: "https://via.placeholder.com/150",
      description: "easy to wear"
    },
    {
      _id: "product4",
      name: "hat",
      category: "hats",
      price: 5,
      stockQuantity: 75,
      imageUrl: "https://via.placeholder.com/150",
      description: "hair items"
    },
    {
      _id: "product5",
      name: "shoes",
      category: "footwears",
      price: 16,
      stockQuantity: 60,
      imageUrl: "https://via.placeholder.com/150",
      description: "good quality"
    }
  ];
  
  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Get all orders
  const getAllOrders = (req, res) => {
    res.status(200).json(orders);
  };
  
  // Get a specific order by ID
  const getOrderById = (req, res) => {
    const { orderId } = req.params;
    const order = orders.find(o => o._id === orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  };
  
  // Create a new order
  const createOrder = (req, res) => {
    const { userId, customerName, shippingAddress, items } = req.body;
    
    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    const newOrder = {
      _id: generateId(),
      userId,
      customerName,
      shippingAddress,
      items: items.map(item => ({
        _id: generateId(),
        ...item
      })),
      totalAmount,
      paymentStatus: "pending",
      status: "Ordered",
      placedDate: new Date(),
      createdAt: new Date()
    };
    
    orders.push(newOrder);
    
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  };
  
  // Update order
  const updateOrder = (req, res) => {
    const { orderId } = req.params;
    const { customerName, shippingAddress, items, paymentStatus, status } = req.body;
    
    const orderIndex = orders.findIndex(o => o._id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Calculate total amount
    const totalAmount = items ? items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0) : orders[orderIndex].totalAmount;
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      customerName: customerName || orders[orderIndex].customerName,
      shippingAddress: shippingAddress || orders[orderIndex].shippingAddress,
      items: items || orders[orderIndex].items,
      totalAmount,
      paymentStatus: paymentStatus || orders[orderIndex].paymentStatus,
      status: status || orders[orderIndex].status
    };
    
    res.status(200).json({ message: 'Order updated successfully', order: orders[orderIndex] });
  };
  
  // Delete order
  const deleteOrder = (req, res) => {
    const { orderId } = req.params;
    
    const initialLength = orders.length;
    orders = orders.filter(o => o._id !== orderId);
    
    if (orders.length === initialLength) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({ message: 'Order deleted successfully' });
  };
  
  // Add item to order
  const addItemToOrder = (req, res) => {
    const { orderId } = req.params;
    const { productId, quantity } = req.body;
    
    const orderIndex = orders.findIndex(o => o._id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Find product
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const newItem = {
      _id: generateId(),
      productId,
      productName: product.name,
      quantity,
      price: product.price
    };
    
    orders[orderIndex].items.push(newItem);
    
    // Recalculate total amount
    orders[orderIndex].totalAmount = orders[orderIndex].items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    res.status(200).json({ 
      message: 'Item added to order', 
      order: orders[orderIndex],
      item: newItem
    });
  };
  
  // Remove item from order
  const removeItemFromOrder = (req, res) => {
    const { orderId, itemId } = req.params;
    
    const orderIndex = orders.findIndex(o => o._id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const initialLength = orders[orderIndex].items.length;
    orders[orderIndex].items = orders[orderIndex].items.filter(item => item._id !== itemId);
    
    if (orders[orderIndex].items.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in order' });
    }
    
    // Recalculate total amount
    orders[orderIndex].totalAmount = orders[orderIndex].items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    res.status(200).json({ 
      message: 'Item removed from order', 
      order: orders[orderIndex] 
    });
  };
  
  // Get all products (for product selection in frontend)
  const getAllProducts = (req, res) => {
    res.status(200).json(products);
  };
  
  module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    addItemToOrder,
    removeItemFromOrder,
    getAllProducts
  };