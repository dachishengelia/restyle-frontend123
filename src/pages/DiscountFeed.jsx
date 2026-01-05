import React from "react";
import products from "../data/products"; // make sure to import your product list
import ProductCard from "../components/ProductCard";

export default function DiscountFeed({ favorites, toggleFav, cart, addToCart, removeFromCart }) {
  const discounted = products.filter((p) => p.discount > 0);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Top Discounts</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {discounted.map((p) => (
          <ProductCard
            key={p._id}
            p={p}
            onToggleFavProp={toggleFav} // match ProductCard prop
            isFav={favorites.includes(p._id)}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            onDelete={null} // no delete action here
          />
        ))}
      </div>
    </div>
  );
}
