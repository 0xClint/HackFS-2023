"use client";
import ConnectWallet from "./ConnectWallet";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Header = () => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BYREX_TOKEN}`,
      };

      const options = {
        method: "GET",
        headers: headers,
      };

      try {
        const response = await fetch(
          `https://api.zondax.ch/fil/data/v1/calibration/account/balance/${address}`,
          options
        );
        const apiData = await response.json();
        console.log(apiData);
        setBalance((apiData.balances[0].value / 10 ** 18).toFixed(1));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="h-[75px] flex py-10 px-5 items-center justify-between bg-[#1F1D2B]">
      <div className="flex items-center gap-10">
        <Link
          href="/"
          className="logo w-[55px] h-[55px] bg-white rounded-[50%] text-[#646D8A] mr-10 flex justify-center items-center"
        >
          {/* <Logo className="w-26 h-26" /> */}
          <Image src={logoIcon} height={40} width={40}></Image>
        </Link>

        <div className="midItems list-none  gap-16 text-white text-[1.1rem] flex">
          <li className="cursor-pointer">
            <Link href="/">App Menu</Link>
          </li>
          <li className="cursor-pointer">
            <Link href="/commits">Commits</Link>
          </li>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-[150px] cursor-pointer">
          Balance : {balance ? balance : "loading..."}Fil
        </div>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
