'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  price: number;
  quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POSSystem() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const getMockProducts = (): Product[] => {
    return [
      { id: "1", name: "Whole Milk 1L", category: "Dairy", barcode: "7891234567891", price: 4.99, quantity: 48 },
      { id: "2", name: "White Bread 500g", category: "Bakery", barcode: "7891234567892", price: 2.99, quantity: 30 },
      { id: "3", name: "Fresh Eggs 12ct", category: "Dairy", barcode: "7891234567893", price: 5.99, quantity: 24 },
      { id: "4", name: "Orange Juice 1L", category: "Beverages", barcode: "7891234567894", price: 5.49, quantity: 32 },
      { id: "5", name: "Greek Yogurt 500g", category: "Dairy", barcode: "7891234567895", price: 5.49, quantity: 36 },
      { id: "6", name: "Butter 250g", category: "Dairy", barcode: "7891234567896", price: 4.49, quantity: 40 },
      { id: "7", name: "Cheddar Cheese 200g", category: "Dairy", barcode: "7891234567897", price: 5.49, quantity: 28 },
      { id: "8", name: "Chocolate Milk 500ml", category: "Beverages", barcode: "7891234567898", price: 3.49, quantity: 25 },
      { id: "9", name: "Apple Juice 1L", category: "Beverages", barcode: "7891234567899", price: 4.50, quantity: 24 },
      { id: "10", name: "Croissant Pack 4ct", category: "Bakery", barcode: "7891234567900", price: 5.99, quantity: 24 },
      { id: "11", name: "Sourdough Bread", category: "Bakery", barcode: "7891234567901", price: 4.99, quantity: 15 },
      { id: "12", name: "Bottled Water 500ml", category: "Beverages", barcode: "7891234567902", price: 1.29, quantity: 120 }
    ];
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      let productsArray: Product[] = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data && data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else {
        productsArray = getMockProducts();
      }
      
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data on error
      setProducts(getMockProducts());
      setError('Using demo products. Connect backend for real data.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async (paymentMethod: string) => {
    if (cart.length === 0) {
      alert('Cart is empty. Add items before checkout.');
      return;
    }

    const transaction = {
      id: `TXN-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      payment: paymentMethod,
      items_count: cart.reduce((sum, item) => sum + item.quantity, 0),
      total: total,
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    try {
      await fetch('http://localhost:8000/api/pos-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }

    alert(`Transaction complete!\nPayment: ${paymentMethod}\nTotal: $${total.toFixed(2)}`);
    clearCart();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Panel - Products */}
      <div className="flex-1 border-r border-gray-200 p-6 overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            {error}
          </div>
        )}
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No products found matching "{searchTerm}"
            </div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.barcode}</p>
                <p className="text-lg font-bold text-blue-600 mt-1">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Stock: {product.quantity}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-semibold text-gray-900">Current Sale</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cart is empty.</p>
              <p className="text-xs text-gray-400 mt-1">Add items to start</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)} 
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)} 
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)} 
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => handleCheckout('cash')}
              disabled={cart.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign size={18} /> Cash
            </button>
            <button 
              onClick={() => handleCheckout('card')}
              disabled={cart.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={18} /> Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}