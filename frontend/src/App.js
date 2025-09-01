import React from "react";
import Main from "./components/main";
import Header from "./components/header";
import CardDetail from "./components/pages/cardDetail";
import AddMovie from "./components/pages/addMovie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Favorites from "./components/pages/favorites";
import User from "./components/pages/user/userMain";
import Login from "./components/pages/login";
import Register from "./components/pages/register";
import ResetPassword from "./components/pages/user/resetPassword";
import ChangePassword from "./components/pages/user/changePassword";
import VerifyEmail from "./components/pages/user/emailVerify";

const App = () => {
  return (
    <BrowserRouter>
      <div className="container-fluid p-0 mb-5">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/card-detail" element={<CardDetail />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/card-detail/:id" element={<CardDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ChangePassword />} />
          <Route path="/auth/verify/:token" element={<VerifyEmail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
