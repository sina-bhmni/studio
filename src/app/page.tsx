import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { TeamSection } from "@/components/home/team-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";
import { Marquee } from "@/components/marquee";
import {
  getServices,
  getFeaturedProjects,
  getMembers,
  getTestimonials,
} from "@/lib/data";

export default async function HomePage() {
  const [services, featuredProjects, members, testimonials] = await Promise.all([
    getServices(),
    getFeaturedProjects(),
    getMembers(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <Marquee
        items={[
          "طراحی رابط کاربری",
          "توسعه وب",
          "برندینگ",
          "امنیت شبکه",
          "استراتژی محتوا",
          "سئو",
        ]}
        className="mt-14"
      />
      <ServicesSection services={services} />
      <ProjectsSection projects={featuredProjects} />
      <TeamSection members={members} />
      <TestimonialsSection testimonials={testimonials} />
      <Marquee
        inverted
        items={[
          "بزن بریم برای ساختن چیزی متفاوت",
          "از ایده تا لانچ",
          "استودیو نوا",
        ]}
      />
      <CtaSection />
    </>
  );
}
