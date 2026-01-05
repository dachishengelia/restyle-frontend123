import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios.js";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to fetch product details");
        }
      }
    };

    fetchProduct();
  }, [productId]);

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-red-600">{error}</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-6">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover max-h-[400px]"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h2>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p className="text-2xl font-semibold mb-4 text-green-600">{product.price} GEL</p>

            {product.sizes && product.sizes.length > 0 && (
              <p className="text-sm text-gray-700 mb-2">Available Sizes: {product.sizes.join(", ")}</p>
            )}
            {product.colors && product.colors.length > 0 && (
              <p className="text-sm text-gray-700 mb-4">Available Colors: {product.colors.join(", ")}</p>
            )}


            <p className="text-sm text-gray-500 mb-6">
              Seller: <span className="font-medium">{product.sellerId?.username || "Unknown"}</span>
            </p>
          </div>


          <div className="flex flex-col gap-4">
            <button disabled className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold opacity-50 cursor-not-allowed">
              Add to Cart
            </button>
            <button disabled className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold opacity-50 cursor-not-allowed">
              Buy Now
            </button>
          </div>

          <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
            Buy Now
          </button>

        </div>
      </div>
    </div>
  );
}
