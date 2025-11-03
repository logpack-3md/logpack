import { About } from "@/components/Blocks/about";
import { AboutSobre } from "@/components/Blocks/AboutSobre";
import { Footer } from "@/components/Blocks/footer";
import Header from "@/components/layout/header";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        <Header />

        <div className="flex-grow py-10">

          <About />

        </div>
        
        <div className="flex-grow py-10">

        <AboutSobre />

        </div>
          

        <Separator />

        <Footer />

      </div>
    </>
  );
}
