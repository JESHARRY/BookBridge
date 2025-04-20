import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { FaUserLarge } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import SeeUserData from './SeeUserData';

const AllOrders = () => {
    const [AllOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
    const [userData, setUserData] = useState(null); // Store user data to show in snackbar

    const userRole = localStorage.getItem("role");

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:1000/api/v1/get-all-orders",
                    { headers }
                );
                setAllOrders(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:1000/api/v1/update-status/${orderId}`,
                { status: newStatus }, 
                { headers }
            );
    
            if (response.status === 200) {
                const updatedOrders = AllOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                );
                setAllOrders(updatedOrders);
                setEditIndex(null);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    // Function to handle clicking on the account icon
    const handleAccountClick = async (_id) => {
        try {
            const response = await axios.get(`http://localhost:1000/api/v1/get-user-information`, {
                headers: {
                    id: _id, // Send the userId in the headers
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            if (response.status === 200) {
                setUserData(response.data); // Store the user data
                setSnackbarOpen(true); // Open the snackbar
            } else {
                console.error("User data not found");
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    
    

    return (
        <div className='h-full w-full p-2 md:p-6 text-zinc-100 font-sans'>
            <h1 className='text-4xl md:text-5xl font-bold text-zinc-200 mb-10'>
                📦 All Orders
            </h1>

            <div className="mt-4 bg-gradient-to-r from-[#1e1e2f] to-[#2c2c3f] shadow-lg border border-zinc-700/30 rounded-xl py-4 px-6 flex gap-2 font-semibold text-sm md:text-base text-indigo-200">
                <div className='w-[3%] text-center'>Sr.</div>
                <div className='w-[40%] md:w-[22%] text-center'>Books</div>
                <div className='w-0 md:w-[45%] hidden md:block text-center'>Description</div>
                <div className='w-[17%] md:w-[9%] text-center'>Price</div>
                <div className='w-[30%] md:w-[10%] text-center'>Status</div>
                <div className='w-[10%] md:w-[5%] text-center'><FaUserLarge /></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center mt-10">
                    <Loader />
                </div>
            ) : AllOrders.length === 0 ? (
                <div className='text-center text-xl text-zinc-500 mt-10'>
                    No orders available.
                </div>
            ) : (
                AllOrders.map((items, i) => {
                    const statusColor =
                        items.status === "Cancelled"
                            ? "text-red-400"
                            : items.status === "Delivered"
                            ? "text-green-400"
                            : items.status === "Out for Delivery"
                            ? "text-blue-400"
                            : "text-yellow-400";

                    return (
                        <div
                            key={items._id}
                            className='bg-zinc-900/80 w-full rounded-xl py-4 px-6 flex gap-2 mt-3 border border-zinc-700 hover:border-indigo-500 transition-all duration-300 ease-in-out hover:scale-[1.015] shadow-md hover:shadow-indigo-500/10'
                        >
                            <div className='w-[3%] text-center'>{i + 1}</div>

                            <div className='w-[40%] md:w-[22%] text-center'>
                                <Link
                                    to={`/view-book-details/${items.book._id}`}
                                    className='text-blue-300 hover:underline hover:text-blue-400 transition'
                                >
                                    {items.book.title}
                                </Link>
                            </div>

                            <div className='w-0 md:w-[45%] hidden md:block text-center'>
                                <p className='text-zinc-400'>
                                    {items.book.desc.slice(0, 50)}...
                                </p>
                            </div>

                            <div className='w-[17%] md:w-[9%] text-center'>
                                <span className='text-green-400 font-medium'>
                                    ₹ {items.book.price}
                                </span>
                            </div>

                            <div
                                className='w-[30%] md:w-[16%] text-center'
                                onDoubleClick={() => userRole === 'admin' && setEditIndex(i)}
                            >
                                {editIndex === i ? (
                                    <select
                                        name="status"
                                        autoFocus
                                        className='bg-zinc-800 text-zinc-300 px-2 py-1 rounded outline-none border border-zinc-600 hover:border-indigo-400 transition'
                                        defaultValue={items.status || "Order Placed"}
                                        onChange={(e) => handleStatusChange(items._id, e.target.value)}
                                        onBlur={() => setEditIndex(null)}
                                    >
                                        {["Order Placed", "Out for Delivery", "Delivered", "Cancelled"].map((status, index) => (
                                            <option key={index} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className={`text-sm font-bold cursor-pointer ${statusColor}`}>
                                        {items.status || "Order Placed"}
                                    </span>
                                )}
                            </div>

                            <div className='w-[10%] md:w-[5%] text-center flex items-center justify-center'>
                                <FaUserLarge className='text-indigo-400' onClick={() => handleAccountClick(items.user._id)} />
                            </div>
                        </div>
                    );
                })
            )}

            {/* Snackbar */}
            {snackbarOpen && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white py-4 px-6 rounded-lg shadow-lg max-w-xs w-full">
                    <SeeUserData userData={userData} />
                    <button onClick={() => setSnackbarOpen(false)} className="text-white ml-4">Close</button>
                </div>
            )}
        </div>
    );
};

export default AllOrders;
