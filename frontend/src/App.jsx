import React, { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer/Footer';
import { Routes, Route } from "react-router-dom";
import AllBooks from './pages/allBooks';
import Login from './pages/login';
import SignUp from './pages/signUp';
import Cart from './pages/cart';
import Profile from './pages/profile';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import OTPVerification from './pages/OTPVerification';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './stores/auth';
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';
import AllOrders from './pages/AllOrders';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(()=>{
    if(
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ){
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
      dispatch(authActions.setToken(localStorage.getItem("token")));
    }
  }, [dispatch]);
  return (
    <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />}>
            {role === "user" ? <Route index element={<Favourites />} /> : (<Route index element={<AllOrders />} />)}
            {role === "admin" && <Route path='/profile/add-book' element={<AddBook />} />}
            <Route path='/profile/orderHistory' element={<UserOrderHistory />} />
            <Route path='/profile/settings' element={<Settings />} />
          </Route>
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/LogIn" element={<Login />} />
          <Route path="/updateBook/:id" element={<UpdateBook />} />
          <Route path="view-book-details/:id" element={<ViewBookDetails />} />
          <Route path="/otp" element={<OTPVerification />} />
        </Routes>
        <Footer />
    </div>
  );
};

export default App;
