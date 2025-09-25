import { About } from "@/components/Blocks/about";
import Header from "@/components/layout/header";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        <Header />

        <div className="flex-grow py-15">
          <About />
        </div>

      </div>
    </>
  );
}
