import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import { FaRegBookmark } from "react-icons/fa"; // Sleek Bookmark Icon

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-favourite-books",
          { headers }
        );

        console.log("Fetched Favourites:", response.data);

        if (response.data && response.data.favourites) {
          setFavouriteBooks(response.data.favourites);
        } else {
          setFavouriteBooks([]);
        }
      } catch (error) {
        console.error("Error fetching favourite books:", error);
      }
    };

    fetchFavourites();
  }, []);

  const removeFromFavourites = (bookId) => {
    setFavouriteBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {FavouriteBooks.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {FavouriteBooks.map((item, i) => (
            <div key={item._id || i}>
              <BookCard data={item} showRemoveButton={true} removeFromFavourites={removeFromFavourites} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center animate-fadeIn pt-[12vh]"> 
          {/* Icon with a glowing gradient effect */}
          <div className="relative">
            <FaRegBookmark className="text-8xl text-gray-500 drop-shadow-md transition-transform transform hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-2xl rounded-full"></div>
          </div>

          {/* Text Styling */}
          <p className="text-5xl font-extrabold text-white mt-4 tracking-wide drop-shadow-md">
            No Favourites Yet!
          </p>
          <p className="text-lg text-gray-400 mt-2 max-w-lg leading-relaxed">
            Your saved books will appear here. Start exploring and mark your favourites now!
          </p>

          {/* Action Button */}
          <a
            href="/"
            className="mt-5 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            Browse Books
          </a>
        </div>

      )}
    </div>
  );
};

export default Favourites;
