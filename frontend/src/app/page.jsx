import { About } from "@/components/blocks/Home/about";
import { AboutSobre } from "@/components/blocks/Home/aboutsobre";
import { Footer } from "@/components/blocks/Home/footer";
import Header from "@/components/blocks/Home/header";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        <Header />

        <div className="py-10">

          <About />

        </div>
        
        <div className="py-10">

        <AboutSobre />

        </div>
          

        <Separator />

        <Footer />

      </div>
    </>
  );
}
