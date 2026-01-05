import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProductCard({ p, onDelete, onToggleFavProp }) {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setLikesCount(p.likes?.length || 0);
    setLiked(user ? p.likes?.some((id) => id === user._id) : false);
    setComments(p.comments || []);
  }, [p, user]);

  useEffect(() => {
    if (!user) return;
    const fetchFav = async () => {
      try {
        const res = await axios.get(
          "https://re-style-backend.vercel.app/api/product-actions/my/favorites",
          { withCredentials: true }
        );
        setIsFav(res.data.favorites.includes(p._id));
      } catch (err) {
        console.error("Failed to fetch favorite status:", err);
      }
    };
    fetchFav();
  }, [user, p._id]);

  const isInCart = Array.isArray(cart) && cart.some((item) => item === p._id);

  const handleCartAction = (e) => {
    e.stopPropagation();
    if (isInCart) removeFromCart(p._id);
    else addToCart(p._id, 1);
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        "https://re-style-backend.vercel.app/api/checkout/create-checkout-session",
        {},
        { withCredentials: true }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!p?._id || !onDelete) return;
    try {
      await onDelete(p._id);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to like");

    try {
      const res = await axios.post(
        `https://re-style-backend.vercel.app/api/product-actions/${p._id}/like`,
        {},
        { withCredentials: true }
      );
      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleToggleFav = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to favorite");

    const optimistic = !isFav;
    setIsFav(optimistic);
    if (onToggleFavProp) onToggleFavProp(p._id, optimistic);

    try {
      const res = await axios.post(
        `https://re-style-backend.vercel.app/api/product-actions/${p._id}/favorite`,
        {},
        { withCredentials: true }
      );
      setIsFav(res.data.favorited);
      if (onToggleFavProp) onToggleFavProp(p._id, res.data.favorited);
    } catch (err) {
      console.error("Favorite toggle error:", err);
      setIsFav(!optimistic);
      if (onToggleFavProp) onToggleFavProp(p._id, !optimistic);
    }
  };

  const handleAddComment = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to comment");
    if (!commentInput.trim()) return;

    try {
      const res = await axios.post(
        `https://re-style-backend.vercel.app/api/product-actions/${p._id}/comment`,
        { text: commentInput.trim() },
        { withCredentials: true }
      );
      setComments(res.data.comments);
      setCommentInput("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    try {
      const res = await axios.delete(
        `https://re-style-backend.vercel.app/api/product-actions/${p._id}/comment/${commentId}`,
        { withCredentials: true }
      );
      setComments(res.data.comments);
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  if (!p) return null;

  return (
    <div
      className="border rounded overflow-hidden shadow-sm bg-white hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/product/${p._id}`)}
    >
      <div className="relative">
        <img
          src={
            p.imageUrl
              ? p.imageUrl.replace("/upload/", "/upload/w_400,h_192,c_fill/")
              : "/placeholder.png"
          }
          alt={p.name}
          className="w-full h-48 object-cover"
        />
        {p.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {p.discount}% OFF
          </span>
        )}
        {p.secondhand && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            2nd Hand
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{p.name}</h3>
          <button onClick={handleToggleFav} className="text-sm">
            {isFav ? "♥" : "♡"}
          </button>
        </div>

        <p className="text-sm text-gray-500">{p.category}</p>

        {p.sizes?.length > 0 && (
          <p className="text-xs text-gray-600">Sizes: {p.sizes.join(", ")}</p>
        )}
        {p.colors?.length > 0 && (
          <p className="text-xs text-gray-600">Colors: {p.colors.join(", ")}</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-bold">{p.price} GEL</div>
        </div>

        <button
          onClick={handleCartAction}
          className={`mt-3 w-full ${
            isInCart ? "bg-red-600" : "bg-blue-600"
          } text-white py-2 rounded hover:bg-opacity-80 transition`}
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          className="mt-2 bg-green-600 text-white py-2 rounded w-full hover:bg-green-700"
        >
          Buy Now
        </button>

        {(user?.role === "admin" || user?.role === "seller") && (
          <button
            onClick={handleDelete}
            className="mt-2 bg-red-500 text-white py-2 rounded w-full hover:bg-red-600"
          >
            Delete
          </button>
        )}

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleLike}
            className={`px-3 py-1 rounded ${
              liked ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-pink-600`}
          >
            👍 Like {likesCount}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
          >
            💬 Comment
          </button>
        </div>

        {showComments && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white p-6 rounded shadow-lg w-96 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(false);
                }}
                className="absolute top-2 right-2 text-gray-500 font-bold"
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-2">Comments</h3>
              <div className="max-h-60 overflow-y-auto mb-2">
                {comments.length === 0 ? (
                  <p className="text-gray-500">No comments yet.</p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id || c.createdAt}
                      className="mb-2 text-gray-800 border-b pb-1"
                    >
                      <span className="font-semibold">{c.username}:</span>{" "}
                      <span>{c.text}</span>
                      <div className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                      {user &&
                        (user._id === c.userId || user.role === "admin") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(c._id);
                            }}
                            className="text-red-500 text-xs ml-2"
                          >
                            Delete
                          </button>
                        )}
                    </div>
                  ))
                )}
              </div>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="border p-2 rounded w-full mb-2"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Add Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
