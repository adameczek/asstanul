import IntroAnimation from "@/components/IntroAnimation";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import { getDictionary } from "@/lib/i18n";

export default async function Home() {
  const dict = await getDictionary();

  return (
    <>
      <IntroAnimation intro={dict.intro} />
      <AboutSection />
      <ContactSection contact={dict.contact} />
    </>
  );
}
