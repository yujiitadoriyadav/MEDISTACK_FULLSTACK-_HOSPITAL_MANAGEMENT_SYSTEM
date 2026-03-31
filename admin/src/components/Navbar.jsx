import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";



const Navbar = () => {
  // const [aToken, setAToken ] = useState(false);
  // const [dToken, setDToken ] = useState(false);

  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("Admintoken");
    localStorage.removeItem("Doctortoken");
    localStorage.removeItem("activeRole");
    dispatch(setUserData(null));

    navigate("/");
  };

  return (
    userData && (
      <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
        <div className="flex items-center gap-2 text-xs">
          <img
            className="w-36 sm:w-40 cursor-pointer"
            src={assets.admin_logo}
            alt=""
          />
          <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
            {userData?.role === "doctor" ? "Doctor" : "Admin"}
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-primary text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default Navbar;