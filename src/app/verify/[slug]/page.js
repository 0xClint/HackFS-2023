"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components";
import { ethers } from "ethers";
import { getTables, readTable } from "@/utils/backend";
import { FileIcon } from "@/assets";

const page = ({ params }) => {
  const [commit, setCommit] = useState("");
  const [file, setFile] = useState([]);
  const [lastCommit, setLastCommit] = useState("");

  useEffect(() => {
    const getData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      let res = await getTables(signer);
      let allCommits = await readTable(res);
      await setCommit(
        await allCommits.filter((item) => item["hash"] == params.slug)
      );
    };
    getData();
  }, []);

  const handleUpload = async (e) => {
    setFile([...file, ...e.target.files]);
  };

  const handleDelete = (name) => {
    let newFiles = file.filter((item) => {
      if (item.name != name) {
        return item;
      }
    });
    setFile(newFiles);
  };
  console.log(commit[0]);
  return (
    <div className="bg-[#1F1D2B] w-screen h-screen text-white">
      <Header />
      <div className="w-[100%] h-[100%] flex justify-center items-start pt-24">
        <div className="container h-[430px] w-[700px] rounded-3xl py-7  bg-[#252836] px-7 text-center flex flex-col  gap-2">
          <div className="titleContainer flex justify-between items-center">
            <div className="left ">
              <p className="text-[12px] font-semibold text-[#a3a3a2] text-left">
                Commit
              </p>
              <h2 className="text-[1.7rem] font-bold text-left">
                {commit[0] ? commit[0].title : "commit name"}
              </h2>
              <p className="  text-[15px]">
                Upload the exact files to get verify
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <button className="mb-1" onInputCapture={(e) => handleUpload(e)}>
                <label className=" w-full border rounded-lg m-0 px-4 py-3 leading-5">
                  <span className="font-semibold text-lg ">Browse</span>
                  <input type="file" className="hidden" multiple />
                </label>
              </button>

              <div className="right text-center w-full translate-y-[8px] font-semibold cursor-pointer">
                Files :{commit[0] ? commit[0].numFile : "num"}
              </div>
            </div>
          </div>
          <div className="fileContainer h-[180px] overflow-auto border-[1px] border-[#9c9c9c] rounded-lg flex flex-col gap-1">
            {file
              ? file.map(({ name, type }, index) => {
                  return (
                    <div
                      className="flex h-10 gap-3 items-center justify-between px-5 py-7 cursor-pointer font-semibold"
                      id={name}
                    >
                      <div className="flex  gap-3 items-center">
                        <p className="">{index + 1}</p>
                        <FileIcon width={45} height={45} />
                        <div>
                          <h3 className="text-[1rem] mb-[2px]">{name}</h3>
                          <p className="text-xs">{type}</p>
                        </div>
                      </div>
                      <button
                        className="mr-5 hover:text-[#585858]"
                        onClick={() => handleDelete(name)}
                      >
                        remove
                      </button>
                    </div>
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
