import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [MobileNav, setMobileNav] = useState("hidden");

  // Dynamically create nav links based on auth state
  const getLinks = () => {
    if (!isLoggedIn) {
      return [
        { title: "Home", link: "/" },
        { title: "All Books", link: "/all-books" },
      ];
    }

    if (role === "admin") {
      return [
        { title: "Home", link: "/" },
        { title: "All Books", link: "/all-books" },
        { title: "Cart", link: "/cart" },
        { title: "Admin Profile", link: "/profile" },
      ];
    }

    // role === "user"
    return [
      { title: "Home", link: "/" },
      { title: "All Books", link: "/all-books" },
      { title: "Cart", link: "/cart" },
      { title: "Profile", link: "/profile" },
    ];
  };

  const links = getLinks();

  return (
    <>
      <nav className='z-50 relative flex bg-zinc-800 text-white px-8 py-2 items-center justify-between'>
        <Link to="/" className='flex items-center'>
          <img className='h-10 me-4' src='book.png' alt='logo'/>
          <h1 className='text-2xl font-semibold'>BookBridge</h1>
        </Link>
        <div className='nav-links-bookbridge block md:flex items-center gap-4'>
          <div className='hidden md:flex gap-4'>
            {links.map((item, i) => (
              <div key={i} className='flex items-center'>
                <Link to={item.link} 
                  className={item.title.includes("Profile") 
                    ? 'px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition duration-300' 
                    : 'hover:text-blue-500 transition-all duration-300'}>
                  {item.title}
                </Link>
              </div>
            ))}
          </div>

          {!isLoggedIn && (
            <div className='hidden md:flex gap-4'>
              <Link to="/LogIn"
                className='px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition duration-300'>
                LogIn
              </Link>
              <Link to="/SignUp"
                className='px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition duration-300'>
                SignUp
              </Link>
            </div>
          )}

          <button className='block md:hidden text-white text-2xl hover:text-zinc-400' 
            onClick={() => setMobileNav(MobileNav === "hidden" ? "block" : "hidden")}>
            <FaGripLines />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}>
        {links.map((item, i) => (
          <Link key={i} to={item.link}
            className='text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300'
            onClick={() => setMobileNav("hidden")}>
            {item.title}
          </Link>
        ))}
        {!isLoggedIn && (
          <>
            <Link to="/LogIn"
              className='px-8 mb-8 text-3xl font-semibold py-2 border border-blue-500 rounded text-white hover:bg-white-800 hover:text-zinc-800 transition duration-300'
              onClick={() => setMobileNav("hidden")}>
              LogIn
            </Link>
            <Link to="/SignUp"
              className='px-8 mb-8 text-3xl font-semibold py-2 border border-blue-500 rounded text-white hover:bg-white-800 hover:text-zinc-800 transition duration-300'
              onClick={() => setMobileNav("hidden")}>
              SignUp
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
