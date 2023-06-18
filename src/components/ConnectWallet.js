"use client";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { UserIcon } from "../assets";

const ConnectWallet = () => {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    deactivateWeb3,
    Moralis,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    // if (isWeb3Enabled) return;

    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, []);

  useEffect(() => {
    // Moralis
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div className=" flex justify-center items-center  gap-2">
          {/* <Link to="/create/user"> */}
          <div className="flex items-center gap-2 cursor-pointer">
            <UserIcon />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[0.9rem] "> guest</p>
                {/* {isSeller && (
                    <p className="text-[0.7rem] text-[#ffffff] bg-[#0074A7] rounded-md w-10 text-center h-4">
                      Seller
                    </p>
                  )} */}
              </div>
              <p className="text-[0.7rem] font-normal text-[#808191]">
                {account.slice(0, 7)}...
                {account.slice(account.length - 4)}
              </p>
            </div>
          </div>
          {/* </Link> */}
          {/* <div className="h-9 w-[2px] bg-[#D9D9D9] mx-3"></div>
          <Link to="/orders">
            <div className="flex items-center gap-1 cursor-pointer">
              <CartIcon className="h-7 w-7" />
              <p>Orders</p>
            </div>
          </Link> */}
        </div>
      ) : (
        <button
          className="border-[1.5px] border-white py-1.5 text-[0.9rem] px-4 w-[100%] rounded-[10px] hover:border-primaryColor hover:text-primaryColor"
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
