"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Message_data } from "@/context/context";
import { Header } from "@/components";

const page = () => {
  const [title, setTitle] = useState("");
  const [isErrortitle, setIsErrorTitle] = useState(false);
  const [file, setFile] = useState([]);
  const { setTitleStore, setFileStore } = useContext(Message_data);
  const router = useRouter();

  const handleChange = async (e) => {
    setFile([...file, ...e.target.files]);
  };

  const handleUpload = async () => {
    if (title && file.length != 0) {
      await setTitleStore(title);
      await setFileStore(file);
      router.push("/generate");
    } else {
      setIsErrorTitle(true);
      setTimeout(() => setIsErrorTitle(false), 2000);
    }
  };
  return (
    <div className="bg-[#1F1D2B] w-screen h-screen text-white">
      <Header />
      <div className="w-[100%] h-[100%] flex justify-center items-start pt-24">
        <div className="container h-[350px] w-[600px] rounded-3xl py-7  bg-[#252836] px-7 text-center flex flex-col  gap-7">
          <div className="">
            <label
              // for="large-input"
              className="block mb-2 text-md font-semibold text-left"
            >
              Enter Commit Name
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className=" rounded-[11px] px-4 py-1 h-10 bg-[#353340] w-[100%]"
              />
            </div>
          </div>
          <div className="h-24 border rounded-lg flex justify-center items-center flex-col gap-2">
            <div className="font-bold">
              {file.length ? (
                <p className="text-center ">
                  File selected <br /> Press upload to continue
                </p>
              ) : (
                <p className="">Drag an Drop files to upload</p>
              )}
            </div>
            <input
              type="file"
              multiple
              className="border rounded-md"
              onChange={(e) => handleChange(e)}
            ></input>
          </div>
          <div>
            <p className="h-6 mb-1 text-red-400">
              {isErrortitle && "Please fill all the fields"}
            </p>
            <button
              onClick={() => handleUpload()}
              className="bg-[#565F8B] text-[1.5rem] font-semibold w-[100%] py-3 rounded-lg"
            >
              Upload
            </button>
            <p className="text-[0.9rem] mt-1">
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
