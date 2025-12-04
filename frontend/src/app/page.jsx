import { About } from "@/components/Blocks/Home/about";
import { AboutSobre } from "@/components/Blocks/Home/aboutsobre";
import { Footer } from "@/components/Blocks/Home/footer";
import Header from "@/components/Blocks/Home/header";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        <Header />

        <div className="py-1">

          <About />

        </div>
        
        <div className="py-15">

        <AboutSobre />

        </div>
          

        <Separator />

        <Footer />

      </div>
    </>
  );
}
