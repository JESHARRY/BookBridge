import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const [Cart, setCart] = useState(undefined);
  const [Total, setTotal] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/v1/get-cart", { headers });
        setCart(Array.isArray(res.data.cart) ? res.data.cart : []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    if (Cart) {
      const totalPrice = Cart.reduce((acc, item) => acc + Number(item.price || 0), 0);
      setTotal(totalPrice);
    }
  }, [Cart]);

  const deleteItem = async (bookid) => {
    try {
      await axios.delete("http://localhost:1000/api/v1/remove-book-from-cart", {
        headers: { ...headers, bookid },
      });
      setCart((prevCart) => prevCart.filter((item) => item._id !== bookid));
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  const PlaceOrder = async() => {
    try{
      const response = await axios.post(
        `http://localhost:1000/api/v1/place-order`,
        {order: Cart},
        {headers}
      );
      alert(response.data.message);
      NavigationHistoryEntry("/profile/orderHistory");
    }catch(error){
      console.log(error);
    }
  };

  const GST = {
    CGST: (Total * 0.18).toFixed(2),
    SGST: (Total * 0.18).toFixed(2),
    IGST: (Total * 0.28).toFixed(2),
    finalTotal: (Total + Total * 0.28).toFixed(2),
  };

  return (
    <div className="bg-zinc-900 min-h-screen p-8">
      {Cart === undefined && <Loader />} 

      {Cart && Cart.length === 0 && (
        <div className="h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">Your Cart is Empty</h1>
          <img 
            src="/empty-cart.png" 
            alt="Empty Cart" 
            className="h-[20vh] md:h-[10vh] object-contain max-w-full"
          />
        </div>
      )}

      {Cart && Cart.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-white mb-8 text-center">🛒 Your Cart</h1>

          <div className="max-w-4xl mx-auto bg-zinc-800 p-6 rounded-lg shadow-lg">
            <AnimatePresence>
              {Cart.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between border-b border-gray-700 py-4"
                >
                  <img src={item.url} alt={item.title} className="h-[10vh] w-[10vh] object-cover rounded" />

                  <div className="flex-1 ml-4">
                    <h1 className="text-xl text-white font-semibold">{item.title}</h1>
                    <p className="text-gray-400 text-sm">{item.desc.slice(0, 100)}...</p>
                  </div>

                  <h2 className="text-white text-2xl font-semibold">₹{item.price}</h2>

                  <button
                    className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300"
                    onClick={() => deleteItem(item._id)}
                  >
                    <AiFillDelete size={24} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Total Price Section */}
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-purple-700 to-blue-800 text-white rounded-lg shadow-lg flex flex-col items-center text-center">
            <h2 className="text-3xl font-semibold">Subtotal: ₹{Total}</h2>
            <p className="text-lg">CGST (7%): ₹{GST.CGST}</p>
            <p className="text-lg">SGST (7%): ₹{GST.SGST}</p>
            <p className="text-lg font-semibold mt-2">Total (incl. GST 14%): ₹{GST.finalTotal}</p>
            <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold" onClick={PlaceOrder}>
              <FaShoppingCart /> Place Your Order
            </button>
            
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;