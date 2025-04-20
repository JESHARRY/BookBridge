import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        if (!token || !userId) {
          console.error('Missing token or user ID in localStorage');
          return;
        }

        const headers = {
          id: userId,
          Authorization: `Bearer ${token}`,
        };

        const res = await axios.get('http://localhost:1000/api/v1/get-cart', { headers });
        setCart(res.data.cart);
        setLoading(false); // Data fetched successfully
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setLoading(false); // In case of error, stop loading
      }
    };

    fetchCart();
  }, []);

  const deleteItem = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');

      const headers = {
        id: userId,
        bookid: bookId,
        Authorization: `Bearer ${token}`,
      };

      await axios.delete('http://localhost:1000/api/v1/remove-book-from-cart', { headers });

      setCart(prev => prev.filter(item => item._id !== bookId));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  useEffect(() => {
    if (cart && cart.length > 0) {
      // Ensure the price is treated as a number and sum it up
      const totalPrice = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
      setTotal(totalPrice);
    }
  }, [cart]);

  const PlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');

      const headers = {
        id: userId,
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        "http://localhost:1000/api/v1/place-order",
        { order: cart },
        { headers }
      );

      alert(response.data.message);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.log(error);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 to-zinc-800 p-6">
      {loading ? <div className='w-full h-[100%] flex items-center justify-center'><Loader />{" "}</div> : cart.length === 0 ? (
        <div className="h-screen">
          <div className="h-full flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
              Empty Cart
            </h1>
            <img
              src="/emptycart.png"
              alt="empty cart"
              className="lg:h-[50vh]"
            />
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-lg">
            🛒 Your Cart
          </h1>

          <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            {cart.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col md:flex-row items-start gap-6 bg-zinc-800/70 backdrop-blur-md rounded-xl shadow-md overflow-hidden px-6 py-4 transition-all duration-300 hover:scale-[1.015] hover:border-[1.5px] hover:border-cyan-400 border border-transparent"
              >
                <img
                  src={item.url}
                  alt="book"
                  className="h-[140px] w-auto object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                />

                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-xl font-semibold text-zinc-100">{item.title}</h2>
                    <span className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm">
                      Fiction
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 mt-2">
                    {item.desc.length > 100 ? `${item.desc.slice(0, 100)}...` : item.desc}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(4)}
                        <span className="text-zinc-500 ml-1">4.0</span>
                      </div>

                      <div className="ml-4 text-green-400 text-sm font-medium">
                        ✅ In Stock
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold text-green-400">
                      ₹{item.price}
                    </h2>
                  </div>

                  {/* Individual Place Order Button */}
                  <button
                    className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm transition duration-200 w-full"
                  >
                    Place Your Order
                  </button>
                </div>

                <button
                  className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full self-center md:self-start transition duration-200"
                  onClick={() => deleteItem(item._id)}
                  title="Remove from cart"
                >
                  <AiFillDelete size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Total Amount + Place Order at Bottom Center */}
          <div className="mt-16 w-full flex justify-center px-4">
            <div className="p-6 bg-zinc-800 rounded-xl shadow-lg max-w-sm w-full transition-all duration-300 hover:scale-[1.015] hover:border-[1.5px] hover:border-cyan-400 border border-transparent">
              <h1 className="text-3xl text-zinc-200 font-bold mb-3">
                Total Amount
              </h1>
              <div className="flex items-center justify-between text-xl text-zinc-200 mb-4">
                <h2>{cart.length} {cart.length === 1 ? 'book' : 'books'}</h2>
                <h2>₹{total}</h2>
              </div>
              <button
                className="mt-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-semibold rounded-lg py-3 px-6 w-full text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
                onClick={PlaceOrder}
              >
                Place Your Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
