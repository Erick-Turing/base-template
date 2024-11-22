import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock API for fetching products
const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Laptop", price: 999.99 },
        { id: 2, name: "Smartphone", price: 599.99 },
        { id: 3, name: "Headphones", price: 149.99 },
        { id: 4, name: "Tablet", price: 299.99 },
        { id: 5, name: "Smartwatch", price: 199.99 },
      ]);
    }, 500);
  });
};

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card className="w-full sm:w-64">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span>{item.name}</span>
      <div className="flex items-center">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 mr-2"
        />
        <Button variant="destructive" size="sm" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      </div>
    </div>
  );
};

const Cart = ({ items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="w-full sm:w-96">
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>Total:</span>
        <Badge variant="secondary">${total.toFixed(2)}</Badge>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart App</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Cart</h2>
          <Cart items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
        </div>
      </div>
    </div>
  );
}