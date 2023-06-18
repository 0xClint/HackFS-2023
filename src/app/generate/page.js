"use client";
import { useContext, useState, useEffect } from "react";
import { Message_data } from "@/context/context";
import { useMoralis } from "react-moralis";
import { Header } from "@/components";
import { downloadHash, downloadSequence } from "@/utils/getSequence";
import { FileIcon } from "@/assets";
import { ethers } from "ethers";
import Link from "next/link";
import loaderGif from "@/assets/loader.json";
import Lottie from "react-lottie-player";
import {
  addCommit,
  createTable,
  getTables,
  readLastCommit,
  readTable,
} from "@/utils/backend";
import fileHash from "@/utils/FileHash";
import getMerkleRootHash from "@/utils/MerkleTree";
import Image from "next/image";
import hashIcon from "@/assets/hash.png";
import lightHouseIcon from "@/assets/lighthouse.png";
import web3StorageIcon from "@/assets/web3Storage.png";
import blockChainIcon from "@/assets/blockchain.png";
import { uploadWeb3 } from "@/utils/web3Storage";

const page = () => {
  const { titleStore, fileStore, setFileStore } = useContext(Message_data);
  const { account } = useMoralis();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState([]);
  const [lastMerkleRoot, setLastMerkleRoot] = useState("");
  const [tableId, setTableId] = useState("");
  const [isNewUser, setisNewUser] = useState(true);
  const [rootHash, setRootHash] = useState("");
  const [tableExist, settableExist] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // console.log(fileStore);
  console.log();

  useEffect(() => {
    setFile(fileStore);
  }, []);

  useEffect(() => {
    const getTemp = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      let res = await getTables(signer);
      // console.log(res);
      if (res == 0) {
        setisNewUser(true);
      } else {
        setisNewUser(false);
        setTableId(res);
        setLastMerkleRoot(await readLastCommit(res));
      }
    };
    getTemp();
  }, [account]);

  const handleExtraUpload = async (e) => {
    console.log(e.target.files);
    setFile([...file, ...e.target.files]);
    await setFileStore([...file, ...e.target.files]);
  };

  const handleDelete = (name) => {
    let newFiles = file.filter((item) => {
      if (item.name != name) {
        return item;
      }
    });
    setFile(newFiles);
    console.log(newFiles);
  };

  const downloadList = async () => {
    downloadSequence(file);
  };

  const handledownloadHash = () => {
    downloadHash(rootHash);
  };

  const generateHash = async () => {
    if (file.length != 0) {
      setLoader(true);
      setTimeout(async () => {
        let hashes = [lastMerkleRoot];

        if (isNewUser) {
          hashes = [];
        }

        let tempHash;
        for (let i = 0; i < file.length; i++) {
          let hash = await fileHash(file[i]);
          // console.log(hash);
          await hashes.push(hash);
        }
        tempHash = await getMerkleRootHash(hashes);
        await setRootHash(tempHash);
        setLoader(false);
        setIsModal(true);
      }, 2000);
    }
  };

  const createUserTable = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await createTable(signer);
  };

  const addUserCommit = async () => {
    setIsModal(false);
    setLoader(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const cId = await uploadWeb3(file);
    console.log(signer, file.length, cId, rootHash, titleStore);

    await addCommit(signer, file.length, cId, rootHash, titleStore);
    setLoader(false);
    setIsSuccess(true);
  };

  return (
    <div className="bg-[#1F1D2B] w-screen h-screen text-white">
      <Header />
      {isModal && (
        <div
          className="fixed top-0 w-screen h-[100%]  flex justify-center items-center -z-1"
          style={{ background: "rgba(0, 0, 0, 0.27)" }}
        >
          <div className="z-1000 w-[450px] text-center  bg-[#252836] rounded-xl py-10 px-10 flex flex-col justify-center items-center gap-3">
            <h2 className=" text-[1.5rem] mb-2">Hash Generated!</h2>
            <Image src={hashIcon} alt="hash success" height={150} width={150} />
            <div className="flex flex-col w-[100%] text-center">
              <p className="font-medium  ">Your Hash:</p>
              <p className="w-[100%] break-words">
                {rootHash ? rootHash : "rootHash"}
              </p>
              <p
                className=" text-blue-600 underline cursor-pointer"
                onClick={() => handledownloadHash()}
              >
                download hash
              </p>
            </div>
            <div>
              <h2>Save files on</h2>
              <div className="flex justify-center items-center gap-4 my-2">
                <Image
                  src={lightHouseIcon}
                  height={45}
                  width={45}
                  className="cursor-pointer hover:scale-110"
                ></Image>
                <Image
                  src={web3StorageIcon}
                  height={45}
                  width={45}
                  className="cursor-pointer hover:scale-110"
                ></Image>
              </div>
            </div>
            <div>
              <button
                onClick={() => addUserCommit()}
                className="bg-[#565F8B] text-[1.2rem] font-medium w-[120px] py-3 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccess && (
        <div
          className="fixed top-0 w-screen h-[100%]  flex justify-center items-center -z-1"
          style={{ background: "rgba(0, 0, 0, 0.27)" }}
        >
          <div className="z-1000 w-[450px] text-center  bg-[#252836] rounded-xl py-8 px-10 flex flex-col justify-center items-center gap-5">
            <h2 className=" text-[1.5rem] mb-2">Commit Added!</h2>
            <Image
              src={blockChainIcon}
              alt="hash success"
              height={150}
              width={150}
            />
            <div className="flex flex-col justify-center items-center w-[100%] text-center">
              <p className="font-medium  mb-3">Thank you for using</p>
              <p
                className=" text-blue-600 underline cursor-pointer"
                onClick={() => handledownloadHash()}
              >
                get Root Hash
              </p>
            </div>

            <div>
              <Link href={`/menu`}>
                <button className="bg-[#565F8B] text-[1.2rem] font-medium w-[120px] py-3 rounded-md">
                  Add more
                </button>
              </Link>
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
          <div>
            <div className="fileContainer h-[250px] overflow-auto border-[1px] border-[#9c9c9c] rounded-2xl flex flex-col gap-3">
              {file
                ? file.map(({ name, type }, index) => {
                    return (
                      <div
                        className="flex h-10 gap-3 items-center justify-between px-5 py-7 cursor-pointer"
                        id={name}
                      >
                        <div className="flex  gap-3 items-center">
                          <p className="">{index + 1}</p>
                          <FileIcon className="h-8 w-8" />
                          <div>
                            <h3 className="text-[1rem] mb-[2px]">{name}</h3>
                            <p className="text-xs">{type}</p>
                          </div>
                        </div>
                        <button
                          className="mr-5 hover:text-[#585858]"
                          onClick={() => handleDelete(name)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                : "No File Uploaded"}
            </div>
            <p className=" text-red-600 font-normal text-sm text-center my-1">
              {file && file.length ? "" : "Please upload the file"}
            </p>
          </div>
          <div>
            <div>
              {isNewUser ? (
                <button
                  onClick={() => createUserTable()}
                  className="bg-[#565F8B] text-[1.5rem] font-semibold w-[100%] py-3 rounded-lg"
                >
                  Create Table
                </button>
              ) : (
                <div className="flex gap-3 ">
                  <button className=" w-[25%] border rounded-lg">
                    <label className="w-full h-full flex justify-center items-center">
                      Upload more
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onInputCapture={(e) => handleExtraUpload(e)}
                      />
                    </label>
                  </button>
                  <button
                    onClick={() => generateHash()}
                    className="bg-[#565F8B] text-[1.5rem] font-semibold w-[50%] py-3 rounded-lg"
                  >
                    Generate Hash
                  </button>
                  <button
                    className=" w-[25%] border rounded-lg m-0 leading-5"
                    onClick={() => downloadList()}
                  >
                    Download
                    <br /> Sequence
                  </button>
                </div>
              )}
            </div>
            <p className="text-[0.9rem] mt-2 text-[#B7B9D2]">
              You should ensure that you keep track of the files associated with
              this commit name.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
