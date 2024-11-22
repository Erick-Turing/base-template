import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data fetch function
const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
        { id: 2, name: 'Smartphone', price: 499.99, stock: 20 },
        { id: 3, name: 'Headphones', price: 129.99, stock: 30 },
      ]);
    }, 1000);
  });
};

// Product Card Component
function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="sm:w-full w-80">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>In Stock: {product.stock}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

// Cart Item Component
function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span>{item.name} - ${item.price} x </span>
      <div className="flex items-center">
        <Input 
          type="number" 
          value={item.quantity} 
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))} 
          className="w-16 mr-2"
          min="1"
        />
        <Button onClick={() => onRemove(item.id)}>Remove</Button>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts().then(data => setProducts(data));
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  if (!products.length) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h2 className="text-xl mb-2">Products</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-2">Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
              <h3 className="mt-4 font-bold">Total: ${total.toFixed(2)}</h3>
              <Button className="mt-2">Checkout</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}