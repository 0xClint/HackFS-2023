import { Header } from "@/components";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#1F1D2B] w-screen h-screen text-white">
      <Header />
      <div className="w-[100%] h-[100%] flex justify-center items-start pt-24">
        <div className="container h-[300px] w-[600px] rounded-3xl py-7  bg-[#252836] px-7 text-center flex flex-col justify-between gap-7">
          <div>
            <h2 className=" text-[2rem] font-medium">Project name</h2>
            <p>Lorem Ipsum</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/upload"
              className="bg-[#565F8B] text-[1.5rem] font-semibold w-[50%] py-3 rounded-lg"
            >
              Upload
            </Link>
            <Link
              href={"/verify"}
              className="bg-[#353340] text-[1.5rem] font-semibold w-[50%] py-3 rounded-lg"
            >
              Verify
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
