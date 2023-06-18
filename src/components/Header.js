"use client";
import React, { useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import Link from "next/link";
// import { Logo } from "../assets";

const Header = () => {
  return (
    <div className="h-[75px] flex py-10 px-5 items-center justify-between bg-[#1F1D2B]">
      <div className="flex items-center gap-10">
        <Link
          href="/"
          className="logo w-[55px] h-[55px] bg-white rounded-[50%] text-[#646D8A] mr-10 flex justify-center items-center"
        >
          {/* <Logo className="w-26 h-26" /> */}
        </Link>

        <div className="midItems list-none  gap-16 text-white text-[1.1rem] flex">
          <li className="cursor-pointer">
            <Link href="/">Home</Link>
          </li>

          <li className="cursor-pointer">
            <Link href="/">App Menu</Link>
          </li>
          <li className="cursor-pointer">
            <Link href="/commits">Commits</Link>
          </li>
        </div>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
