import MotionProvider from "@/components/MotionProvider";
import BrandSprite from "@/components/BrandSprite";
import Loader from "@/components/Loader";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Divide from "@/components/Divide";
import Marquee from "@/components/Marquee";
import MusesDial from "@/components/MusesDial";
import Services from "@/components/Services";
import Leadership from "@/components/Leadership";
import WhoWeServe from "@/components/WhoWeServe";
import RedPen from "@/components/RedPen";
import Letter from "@/components/Letter";
import Footer from "@/components/Footer";
import GlobalMotion from "@/components/GlobalMotion";

/* Section order matters: pinned sections must mount top-to-bottom so ScrollTrigger measures correctly. */
export default function Home() {
  return (
    <MotionProvider>
      <BrandSprite />
      <Loader />
      <SiteHeader />
      <main id="top" className="relative z-[2]">
        <Hero />
        <Divide />
        <Marquee />
        <MusesDial />
        <Services />
        <Leadership />
        <WhoWeServe />
        <RedPen />
        <Letter />
      </main>
      <Footer />
      <GlobalMotion />
    </MotionProvider>
  );
}
