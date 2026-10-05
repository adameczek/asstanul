import ContactSection from "@/components/ContactSection";
import { getDictionary } from "@/lib/i18n";

export default async function Contact() {
  const dict = await getDictionary();

  return <ContactSection contact={dict.contact} />;
}
