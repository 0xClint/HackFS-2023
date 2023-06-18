"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getTables, readTable } from "@/utils/backend";

const page = () => {
  const [isNewUser, setisNewUser] = useState(true);
  const [tableData, setTabledata] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      let res = await getTables(signer);
      //   await readTable();
      if (res == 0) {
        setisNewUser(true);
      } else {
        setisNewUser(false);
        setTabledata(await readTable(res));
      }
    };
    getData();
  }, []);
  console.log(tableData);
  return <div>page</div>;
};

export default page;
