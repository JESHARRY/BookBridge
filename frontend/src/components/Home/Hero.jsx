import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-12 lg:px-20 py-6 min-h-[90vh]">
      
      {/* Left section with text */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-center md:text-left mt-2 md:mt-0">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-yellow-100 mb-2 sm:mb-4">
          Discover Your Next Great Read
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-zinc-300 mb-4 sm:mb-6 px-2 sm:px-0">
          Uncover captivating stories, enriching knowledge, and endless inspiration 
          in our curated collection of books.
        </p>
        <div className="mt-2 flex justify-center w-full md:justify-start">
          <Link
            to="/all-books"
            className="text-yellow-100 text-base sm:text-lg lg:text-2xl font-semibold border border-yellow-100 px-6 sm:px-10 py-2 sm:py-3 hover:bg-zinc-800 rounded-full"
          >
            Discover Books
          </Link>
        </div>
      </div>

      {/* Right section with image */}
      <div className="w-full md:w-1/2 flex justify-center mb-2 md:mb-0">
        <img
          src="./hero2.png"
          alt="hero"
          className="w-4/5 sm:w-3/4 md:w-full max-w-[400px] object-contain"
        />
      </div>
    </div>
  );
};

export default Hero;
