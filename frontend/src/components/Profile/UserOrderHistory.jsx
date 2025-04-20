import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTruck } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
import { FaBook, FaRupeeSign, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-order-history",
          { headers }
        );
        setOrderHistory(response.data.data);
      } catch (error) {
        console.error("Order history fetch failed:", error); // 👈 LOG THIS
        setOrderHistory([]); // fallback to show "No Orders Yet"
      }
    };
    fetch();
  }, []);
  

  return (
    <>
      {!OrderHistory && <div className='flex items-center justify-center h-[100%]'><Loader /></div>}

      {OrderHistory && OrderHistory.length === 0 && (
        <div className='h-[80vh] p-4 text-zinc-100'>
          <div className='h-full flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-semibold text-zinc-500 mb-8'>No Orders Yet</h1>
            <img
              src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
              alt="no orders"
              className='h-[20vh] mb-8'
            />
          </div>
        </div>
      )}

      {OrderHistory && OrderHistory.length > 0 && (
        <div className='min-h-screen p-2 md:p-6 text-zinc-100'>
          <h1 className='text-3xl md:text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500'>
            📚 Your Order History
          </h1>

          <div className='mt-4 hidden md:flex bg-zinc-800 rounded-lg py-3 px-6 shadow-md border border-zinc-700'>
            <div className='w-[3%] text-center'>Sr.</div>
            <div className='w-[22%] text-center'>Book</div>
            <div className='w-[45%] text-center'>Description</div>
            <div className='w-[10%] text-center'>Price</div>
            <div className='w-[15%] text-center'>Status</div>
            <div className='w-[5%] text-center'>Mode</div>
          </div>

          {OrderHistory.map((items, i) => (
            <div
              key={i}
              className='group flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0 bg-zinc-800 w-full rounded-lg py-4 px-6 my-2 hover:bg-zinc-900 transition-all border border-zinc-700 hover:border-cyan-400 shadow-sm'
            >
              <div className='w-full md:w-[3%] text-center font-semibold text-cyan-400'>{i + 1}</div>

              <div className='w-full md:w-[22%] text-center'>
                <Link to={`/get-books-by-id/${items.book._id}`} className='flex items-center justify-center gap-2 hover:text-blue-300 transition'>
                  <FaBook className="text-lg text-blue-400" />
                  <span>{items.book.title}</span>
                </Link>
              </div>

              <div className='w-full md:w-[45%] text-center text-sm text-zinc-300'>
                {items.book.desc.slice(0, 70)}...
              </div>

              <div className='w-full md:w-[10%] text-center text-green-400 font-semibold flex items-center justify-center gap-1'>
                <FaRupeeSign />
                {items.book.price}
              </div>

              <div className='w-full md:w-[15%] text-center font-medium'>
                {items.status === "Order placed" ? (
                  <div className='flex items-center justify-center text-yellow-400 gap-1'>
                    <MdPendingActions />
                    {items.status}
                  </div>
                ) : items.status === "Order cancelled" ? (
                  <div className='flex items-center justify-center text-red-500 gap-1'>
                    <FaTimesCircle />
                    {items.status}
                  </div>
                ) : (
                  <div className='flex items-center justify-center text-green-500 gap-1'>
                    <FaCheckCircle />
                    {items.status}
                  </div>
                )}
              </div>

              <div className='hidden md:flex w-[5%] justify-center text-green-400 items-center gap-1'>
                <FaMoneyBillWave />
                COD
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserOrderHistory;
