import React, { useEffect, useState } from "react";
import Toaster from "react-hot-toast";
import UserMovies from "./userMovie";
import UserProfile from "./userProfile";

export default function UserMain() {
  return (
    <div className="container my-5">
      <UserProfile />
      <UserMovies />
      <Toaster />
    </div>
  );
}
