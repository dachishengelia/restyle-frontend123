import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import logo from "/logo.png";

export default function Navbar({ favoritesCount }) {
  const { user, signOut } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-14 h-14 object-contain" />
          <span className="font-bold text-2xl text-gray-800">ReStyle</span>
        </div>

        <nav className="flex items-center gap-6">
          {/* Home link adapts to user role */}
          <Link
            to={
              user
                ? user.role === "admin"
                  ? "/admin"
                  : user.role === "seller"
                  ? "/your-products"
                  : "/"
                : "/"
            }
            className="text-sm font-medium text-gray-600 hover:text-primary-color transition"
          >
            Home
          </Link>
          <Link to="/favorites" className="text-sm font-medium text-gray-600 hover:text-primary-color transition">Favorites ({favoritesCount})</Link>
          <Link to="/cart" className="text-sm font-medium text-gray-600 hover:text-primary-color transition">Cart ({cart.length})</Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === "seller" && (
                <>
                  {/* <button onClick={() => navigate("/your-products")} className="text-sm font-medium text-blue-600 hover:underline">Your Products</button> */}
                  <button onClick={() => navigate("/add-product")} className="text-sm font-medium text-green-600 hover:underline">Add Product</button>
                </>
              )}
              {user.role === "admin" && <button onClick={() => navigate("/admin")} className="text-sm font-medium text-purple-600 hover:underline">Control Panel</button>}
              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-medium text-gray-700 hover:underline"
              >
                {user.username}
              </button>
              <button
                onClick={signOut}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-white transition">Log In / Sign Up</Link>
          )}
        </nav>
      </div>
    </header>
  );
}