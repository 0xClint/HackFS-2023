"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components";
import { ethers } from "ethers";
import { getLastCommits, getTables, readTable } from "@/utils/backend";
import { CopyIcon, FailedIcon, FileIcon, VerifiedIcon } from "@/assets";
import { retrieveData } from "@/utils/web3Storage";
import Link from "next/link";
import loaderGif from "@/assets/loader.json";
import Lottie from "react-lottie-player";
import fileHash from "@/utils/FileHash";
import getMerkleRootHash from "@/utils/MerkleTree";

const page = ({ params }) => {
  const [commit, setCommit] = useState("");
  const [file, setFile] = useState([]);
  const [loader, setLoader] = useState(false);
  const [prevCommit, setprevCommit] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoader(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      let res = await getTables(signer);
      let allCommits = await readTable(res);
      let targetCommits = await getLastCommits(allCommits, params.slug);
      console.log(targetCommits);
      await setprevCommit(targetCommits[0]);
      await setCommit(targetCommits[1]);
      setLoader(false);
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
  console.log(commit);

  const getFileData = async () => {
    if (commit) {
      setFile(await retrieveData(commit.cid));
    }
  };

  const handleCompare = async () => {
    if (file.length != 0) {
      setLoader(true);
      setTimeout(async () => {
        console.log(prevCommit);
        let hashes = [prevCommit ? prevCommit.hash : null];

        let tempHash;
        for (let i = 0; i < file.length; i++) {
          let hash = await fileHash(file[i]);
          await hashes.push(hash);
        }
        tempHash = await getMerkleRootHash(hashes);
        console.log("Generate RootHash:" + tempHash);
        console.log("Backend RootHash:" + params.slug);
        await setModal(true);
        await setLoader(false);
        if (tempHash === params.slug) {
          console.log("SUCCESS !!!!");
          setIsSuccess(true);
        } else {
          console.log("FAILED !!!!");
          setIsSuccess(false);
        }
      }, 3000);
    }
  };
  return (
    <div className="bg-[#1F1D2B] w-screen h-screen text-white">
      <Header />{" "}
      {modal && (
        <div
          className="fixed top-0 w-screen h-[100%]  flex justify-center items-center -z-1"
          style={{ background: "rgba(0, 0, 0, 0.27)" }}
        >
          <div className="z-1000 w-[450px] text-center  bg-[#252836] rounded-xl py-8 px-10 flex flex-col justify-center items-center gap-5">
            <h2 className=" text-[1.5rem] mb-2">
              {isSuccess ? "Congratulation!" : "Verification failed!"}
            </h2>
            {isSuccess ? <VerifiedIcon /> : <FailedIcon />}
            <div className="flex flex-col justify-center items-center w-[100%] text-center">
              <p className="font-medium  mb-3">
                {isSuccess
                  ? "These files belong to You!"
                  : "Either wrong files uploaded"}
              </p>
              <p
                className=" w-[90%]"
                // onClick={() => handledownloadHash()}
              >
                {isSuccess
                  ? `These files were added on ${" timeStamp "} and are successfully
                verified.`
                  : `or In wrong order! Try again!`}
              </p>
            </div>
            <div>
              {isSuccess ? (
                <Link href={`/`}>
                  <button className="bg-[#565F8B] text-[1.2rem] font-medium w-[120px] py-3 rounded-md">
                    ok
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => setModal(false)}
                  className="bg-[#565F8B] text-[1.2rem] font-medium w-[120px] py-3 rounded-md"
                >
                  ok
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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
          <div className="titleContainer flex justify-between items-center">
            <div className="left ">
              <p className="text-[12px] font-semibold text-[#a3a3a2] text-left">
                Commit
              </p>
              <h2 className="text-[1.7rem] font-bold text-left">
                {commit ? commit.title : "commit name"}
              </h2>
              <p className="  text-[15px]">
                Upload the exact files to get verify
              </p>
            </div>
            <div className=" flex flex-col items-end justify-end gap-1">
              <div className="flex gap-1">
                <button
                  className=""
                  onInputCapture={(e) => handleUpload(e)}
                  onClick={() => handleUpload("sd")}
                >
                  <label className=" w-full border rounded-lg m-0 px-4 py-3 leading-5">
                    <span className="font-semibold text-lg ">Browse</span>
                    <input type="file" className="hidden" multiple />
                  </label>
                </button>
                <button
                  onClick={() => getFileData()}
                  className=" w-[160px] border rounded-lg m-0 px-2 py-3 leading-5"
                >
                  Fetch from IPFS
                </button>
              </div>
              <div className="right text-right w-full translate-y-[8px] font-semibold cursor-pointer">
                Files :{commit ? commit.numFile : "num"}
              </div>
            </div>
          </div>
          <div className="fileContainer h-[220px] overflow-auto border-[1px] border-[#9c9c9c] rounded-lg flex flex-col gap-1">
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
          <div className="my-1">
            <label
              for="large-input"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Merkle Root of this Commit
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={commit ? commit.hash : "RootHash"}
                readOnly
                className="block w-full text-[15px] p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500"
              />
              <div className=" rounded-lg w-10 h-9 flex justify-center items-center bg-gray-100 hover:bg-gray-400 ">
                <CopyIcon
                  onClick={() =>
                    navigator.clipboard.writeText(
                      commit ? commit.merkle_root : ""
                    )
                  }
                />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex gap-3">
                <Link
                  href="/commits"
                  className="bg-[#565F8B] text-[1.5rem] font-semibold w-[50%] py-2 rounded-lg"
                >
                  Back
                </Link>
                <button
                  onClick={() => handleCompare()}
                  className="bg-[#353340] text-[1.5rem] font-semibold w-[50%] py-2 rounded-lg"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
