import { About } from "@/components/Blocks/about";
import { AboutSobre } from "@/components/Blocks/AboutSobre";
import { Footer } from "@/components/Blocks/footer";
import Header from "@/components/layout/header";
import Image from "next/image";

export default function sobre() {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        <Header />

        <div className="flex-grow py-15">
          <AboutSobre />
        </div>

        <Footer />

      </div>
    </>
  );
}
