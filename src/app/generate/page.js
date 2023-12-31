"use client";
import { useContext, useState, useEffect } from "react";
import { Message_data } from "@/context/context";
import { useMoralis } from "react-moralis";
import { Header } from "@/components";
import { downloadSequence } from "@/utils/getSequence";
import { FileIcon } from "@/assets";
import { ethers } from "ethers";
import { addCommit, createTable, getTables, readData } from "@/utils/backend";

const page = () => {
  const { titleStore, fileStore, setFileStore } = useContext(Message_data);
  const { isWeb3Enabled, account } = useMoralis();
  const [isLoader, setIsLoader] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState([]);
  console.log(fileStore);

  useEffect(() => {
    setFile(fileStore);
  }, []);

  useEffect(() => {
    if (!isWeb3Enabled) {
    }
  });
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
    // downloadSequence(file);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    // const signer = await provider.getSigner();
    // await addCommit(signer);
  };

  const generateHash = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    // await createTable(signer);
    await getTables(signer);

    // if (file.length != 0) {
    // }
  };
  return (
    <div className="bg-[#1F1D2B] w-screen h-screen text-white">
      <Header />
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
