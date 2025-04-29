import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm">
        <div>
          <img className="w-40 mb-5" src={assets.newlogo} alt="" />
          <p className="w-full leading-6 text-gray-600 md:w-2/3">
          A comprehensive eye care management system designed to streamline appointments, digitalize prescriptions, 
          and enhance patient-doctor interactions. 
          Experience seamless, efficient, and accessible vision care at your fingertips.
          </p>
        </div>

        <div>
          <p className="mb-5 text-xl font-medium">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xl font-medium">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+94 76 150 4268</li>
            <li>opticare@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ Opticare.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
