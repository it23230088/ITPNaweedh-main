import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  
  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };
  
  return (
    <div className="flex items-center justify-between py-3 px-4 md:px-8 mb-5 border-b border-b-[#ADADAD]">
      <img
        onClick={() => navigate("/")}
        className="cursor-pointer w-32 md:w-36"
        src={assets.newlogo}
        alt=""
      />
      
      <ul className="items-center hidden gap-8 font-medium text-gray-700 md:flex">
        <NavLink to="/" className={({isActive}) => isActive ? "text-primary" : ""}>
          <li className="py-1 hover:text-primary transition-colors">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/productViews" className={({isActive}) => isActive ? "text-primary" : ""}>
          <li className="py-1 hover:text-primary transition-colors">PRODUCTS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors" className={({isActive}) => isActive ? "text-primary" : ""}>
          <li className="py-1 hover:text-primary transition-colors">APPOINTMENTS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? "text-primary" : ""}>
          <li className="py-1 hover:text-primary transition-colors">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact" className={({isActive}) => isActive ? "text-primary" : ""}>
          <li className="py-1 hover:text-primary transition-colors">PRESCRIPTION</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/warranty" className={({isActive}) => isActive ? "text-primary" : ""}>
          <li className="py-1 hover:text-primary transition-colors">WARRANTY</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      
      <div className="flex items-center gap-6">
        {token && userData ? (
          <div className="relative flex items-center gap-2 cursor-pointer group">
            <img className="w-8 h-8 rounded-full object-cover" src={userData?.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 z-20 hidden text-base font-medium text-gray-600 pt-14 group-hover:block">
              <div className="flex flex-col gap-4 p-4 rounded min-w-48 bg-gray-50 shadow-md">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="cursor-pointer hover:text-black"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden px-6 py-2 font-medium text-white rounded-full bg-primary md:block hover:bg-primary/90 transition-colors"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        
        {/* ---- Mobile Menu ---- */}
        <div
          className={`md:hidden ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} className="w-32" alt="" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7"
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-4 px-5 mt-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="inline-block px-4 py-2 rounded-full hover:bg-gray-100">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/productViews">
              <p className="inline-block px-4 py-2 rounded-full hover:bg-gray-100">PRODUCTS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="inline-block px-4 py-2 rounded-full hover:bg-gray-100">APPOINTMENTS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="inline-block px-4 py-2 rounded-full hover:bg-gray-100">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="inline-block px-4 py-2 rounded-full hover:bg-gray-100">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;