"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getTables, readTable } from "@/utils/backend";
import { Header } from "@/components";
import loaderGif from "@/assets/loader.json";
import Lottie from "react-lottie-player";
import Link from "next/link";

const page = () => {
  const [isNewUser, setisNewUser] = useState(true);
  const [tableData, setTabledata] = useState([]);
  const [loader, setLoader] = useState(false);

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
  return (
    <div className="bg-[#1F1D2B] w-screen h-screen text-white">
      <Header />
      {loader && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          <Lottie
            loop
            animationData={loaderGif}
            play
            style={{
              width: 200,
              height: 200,
            }}
          />
        </div>
      )}
      <div className="w-[100%] h-[100%] flex justify-center items-start pt-24">
        <div className="container h-[430px] w-[700px] rounded-3xl py-7  bg-[#252836] px-7 text-center flex flex-col  gap-2">
          <h2 className="text-[2rem] font-bold">Commits</h2>
          <p className="mt-1 mb-6">
            Selects the commit in which the file exists.
          </p>
          <div className="commitsContainer min-h-min max-h-[75%] overflow-auto border-[1px] text-[#424242] border-[#9c9c9c] rounded-xl">
            {/* {commits
              ? commits.map((data, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleClick(data.merkleRoot, index)}
                      className="commit cursor-pointer hover:bg-[#f1f1f1] flex justify-between  gap-3 border-b items-center py-5  pl-6 pr-4 text-[1.1rem] font-semibold"
                    >
                      <p className="w-full text-left">{data.name}</p>
                      <div className="flex gap-1 justify-center items-center mr-4">
                        <div className="text-[1.1rem] text-sm font-normal w-20 flex gap-1">
                          files:
                          <div className="font-semibold rounded-[50%] w-[20px] flex justify-center text-white items-center bg-[#EB4899]">
                            {Number(data.noOfFiles._hex)}
                          </div>
                        </div>
                        <RightArrow className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })
              : ""} */}
            {tableData
              ? tableData.reverse().map(({ hash, numFile, title }) => {
                  return (
                    <Link href={`verify/${hash}`}>
                      <div
                        key={hash}
                        className="commit cursor-pointer text-white flex justify-between  gap-3 border-b items-center py-5  pl-6 pr-4 text-[1.1rem] font-semibold"
                      >
                        <p className="w-full text-left">{title}</p>
                        <div className="flex gap-1 justify-center items-center mr-4">
                          <div className="text-sm font-normal w-20 flex items-center gap-1">
                            files:
                            <div className="font-semibold rounded-[50%]  h-[25px] w-[25px]  border boder-2 flex justify-center text-white items-center">
                              {numFile}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
