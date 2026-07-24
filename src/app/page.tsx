import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Platform } from "@/components/sections/Platform";
import { Leak } from "@/components/sections/Leak";
import { IndustryHub } from "@/components/sections/IndustryHub";
import { System } from "@/components/sections/System";
import { VoxAI } from "@/components/sections/VoxAI";
import { Proof } from "@/components/sections/Proof";
import { Fit } from "@/components/sections/Fit";
import { Onboarding } from "@/components/sections/Onboarding";
import { AgenciesBlock } from "@/components/sections/AgenciesBlock";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="letterbox-divider" aria-hidden />
        <Platform />
        <Leak />
        <IndustryHub />
        <System />
        <div className="letterbox-divider" aria-hidden />
        <VoxAI />
        <Proof />
        <div className="letterbox-divider" aria-hidden />
        <Fit />
        <Onboarding />
        <AgenciesBlock />
        <FAQ />
        <div className="letterbox-divider" aria-hidden />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
