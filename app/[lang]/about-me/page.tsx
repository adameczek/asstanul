import RegularSection from "@/components/about/RegularSection";
import RecruiterSection from "@/components/about/RecruiterSection";
import ModeSwitch from "@/components/about/ModeSwitch";

export default async function AboutMe({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { mode } = await searchParams;
  const isProfessional = mode === "professional";

  return (
    <>
      {isProfessional ? <RecruiterSection /> : <RegularSection />}
      <ModeSwitch mode={typeof mode === "string" ? mode : undefined} />
    </>
  );
}
