import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [message, setMessage] = useState("");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  console.log(isLoggedIn, role);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:1000/api/v1/get-books-by-id/${id}`);
        if (!response.ok) throw new Error("Failed to fetch book details");

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleFavourite = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-favourites",
        {},
        { headers }
      );
      alert(response.data.message);
      handleAction("favorite");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-cart",
        {},
        { headers }
      );
      alert(response.data.message);
      handleAction("cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  

  const handleAction = (actionType) => {
    setIsRotating(true);
    setMessage(actionType === "cart" ? "Book added to cart successfully!" : "Book added to favorites!");

    setTimeout(() => {
      setIsRotating(false);
    }, 1000);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  if (loading) return <div className="text-white text-center mt-5">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-5">Error: {error}</div>;

  return (
    <div className="w-full min-h-screen bg-zinc-900 flex items-center justify-center px-12 py-10">
      <div className="w-full max-w-6xl flex flex-wrap lg:flex-nowrap gap-6">
        
        {/* Book Cover + Icon Buttons */}
        {isLoggedIn === true && role === "user" && (
          <div className="relative bg-zinc-800 rounded-lg p-6 w-full lg:w-2/5 flex items-center justify-center shadow-lg border-[1px] border-gray-500 shadow-gray-900">
          
            {/* Favourites Button (Top-Right) */}
            <button 
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-gray-400 hover:border-red-500 hover:text-red-500 transition-transform transform hover:scale-110 bg-zinc-700 p-2"
              onClick={handleFavourite}
            >
              <FaHeart size={16} />
            </button>

            {/* Book Cover with Rotation Effect */}
            {data && (
              <img
                src={data.url}
                alt="Book Cover"
                className={`h-[70vh] object-cover rounded-lg shadow-md transition-transform duration-1000 ${
                  isRotating ? "rotate-180" : "rotate-0"
                }`}
              />
            )}

            {/* Add to Cart Button (Bottom-Left) */}
            <button 
              className="absolute bottom-4 left-4 w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-gray-400 hover:border-green-500 hover:text-green-500 transition-transform transform hover:scale-110 bg-zinc-700 p-2"
              onClick={handleCart}
            >
              <FaShoppingCart size={16} />
            </button>
          </div>
        )}

        {isLoggedIn === true && role === "admin" && (
          <div className="relative bg-zinc-800 rounded-lg p-6 w-full lg:w-2/5 flex items-center justify-center shadow-lg border-[1px] border-gray-500 shadow-gray-900">
          
            {/* Edit Button (Top-Right) */}
            <button 
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-gray-400 hover:border-red-500 hover:text-red-500 transition-transform transform hover:scale-110 bg-zinc-700 p-2"
              onClick={() => handleAction("favorite")}
            >
              <FaEdit size={16} />
            </button>

            {/* Book Cover with Rotation Effect */}
            {data && (
              <img
                src={data.url}
                alt="Book Cover"
                className={`h-[70vh] object-cover rounded-lg shadow-md transition-transform duration-1000 ${
                  isRotating ? "rotate-180" : "rotate-0"
                }`}
              />
            )}

            {/* Delete Button (Bottom-Left) */}
            <button 
              className="absolute bottom-4 left-4 w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-gray-400 hover:border-green-500 hover:text-green-500 transition-transform transform hover:scale-110 bg-zinc-700 p-2"
              onClick={() => handleAction("cart")}
            >
              <MdOutlineDelete />
            </button>
          </div>
        )}

        {/* Book Details */}
        <div className="p-4 w-full lg:w-3/5 text-white flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-yellow-400">{data.title}</h1>
            <p className="text-lg font-medium text-gray-300">
              Author: <span className="text-white">{data.author}</span>
            </p>
            <p className="text-xl font-semibold mt-2 text-green-400">Price: ₹{data.price}</p>
            <p className="text-md mt-4 text-gray-300 leading-relaxed">{data.desc}</p>
          </div>
        </div>
      </div>

      {/* Message Snackbar */}
      {message && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition-opacity duration-500">
          {message}
        </div>
      )}
    </div>
  );
};

export default ViewBookDetails;
