import { useState } from 'react';
import './App.css';

import ProductList from './components/ProductList';
import Cart from './components/Cart';

const PRODUCTS = [
  { id: 'p1', name: 'Keyboard', price: 29.99 },
  { id: 'p2', name: 'Mouse', price: 19.99 },
  { id: 'p3', name: 'Monitor', price: 149.99 },
];

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAdd = (product) => {
    setCartItems(cartItems.concat(product));
  };

  const handleRemove = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="app">
      <h1>React Shopping Cart</h1>

      <ProductList products={PRODUCTS} onAdd={handleAdd} />
      <Cart items={cartItems} onRemove={handleRemove} />
    </div>
  );
}

export default App;
