import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { WhySection } from "@/components/landing/why-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { Awareness } from "@/components/landing/awareness";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-void">
      <Navbar />
      <Hero />
      <WhySection />
      <HowItWorks />
      <Features />
      <Stats />
      <Awareness />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
