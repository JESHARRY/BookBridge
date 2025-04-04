import React from "react";
import { Link } from "react-router-dom"; // Import Link

const Hero = () => {
  return (
    <div className="h-[90vh] flex flex-col md:flex-row items-center justify-center">
      {/* Left section with text */}
      <div className="w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-start justify-center md:pl-20">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 lg:text-left mb-6">
          Discover Your Next Great Read
        </h1>
        <p className="text-xl text-zinc-300 lg:text-left mb-4">
          Uncover captivating stories, enriching knowledge, and endless inspiration 
          in our curated collection of books.
        </p>
        <div className="mt-8">
          <Link
            to="/all-books"
            className="text-yellow-100 text-xl lg:text-2xl font-semibold border border-yellow-100 px-10 py-3 hover:bg-zinc-800 rounded-full"
          >
            Discover Books
          </Link>
        </div>
      </div>

      {/* Right section (For an image or any other content) */}
      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
        <img src="./hero2.png" alt="hero" />
      </div>
    </div>
  );
};

export default Hero;
