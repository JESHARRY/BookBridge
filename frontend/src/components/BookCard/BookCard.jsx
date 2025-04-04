import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa"; // Broken heart icon for removal
import axios from "axios";

const BookCard = ({ data, removeFromFavourites, showRemoveButton = false }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  };

  const handleRemove = async () => {
    try {
        const response = await axios.delete(
            "http://localhost:1000/api/v1/remove-book-from-favourites",
            {
                headers: {
                    id: localStorage.getItem("id"),
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    bookid: data._id,
                },
            }
        );

        alert(response.data.message);
        setIsRemoving(true);
    } catch (error) {
        console.error("Error removing from favourites:", error.response ? error.response.data : error.message);
    }
  };


  return (
    <div
      className={`relative bg-zinc-800 rounded-lg p-4 flex flex-col items-center transition-all duration-300 ease-in-out border border-gray-500 shadow-lg overflow-hidden ${
        isRemoving ? "transform -translate-x-full opacity-0" : "hover:scale-105"
      }`}
    >
      <Link to={`/view-book-details/${data._id}`} className="w-full">
        <div className="bg-zinc-900 rounded-lg flex items-center justify-center border border-gray-600 p-4 overflow-hidden">
          <img
            src={data.url}
            alt="Book Cover"
            className="h-[25vh] object-contain transition-transform duration-300 ease-in-out transform hover:scale-110"
          />
        </div>
      </Link>

      <h2 className="mt-4 text-xl text-zinc-200 text-center font-semibold">{data.title}</h2>
      <p className="mt-2 text-zinc-400 font-semibold">by {data.author}</p>
      <p className="mt-2 text-zinc-200 text-xl">₹ {data.price}</p>

      {/* Only show "Remove from Favourites" button in Profile Page */}
      {showRemoveButton && (
        <button
          onClick={handleRemove}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-4 py-2 rounded border border-red-500 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <FaHeartBroken className="text-lg" /> Remove from Favourites
        </button>
      )}
    </div>
  );
};

export default BookCard;
