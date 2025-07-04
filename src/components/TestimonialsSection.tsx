import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Honestly? Memento Mori just gets it. I open it instead of TikTok now when I'm feeling overwhelmed.",
    image: "https://randomuser.me/api/portraits/women/31.jpg",
    name: "Naomi C.",
    role: "Student",
  },
  {
    text: "It doesn't try to fix me. It just helps me slow down and think clearly. That's rare.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Arjun P.",
    role: "Creative Director",
  },
  {
    text: "I've journaled on and off for years — this is the only app that made it feel natural.",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    name: "Sophie L.",
    role: "Designer",
  },
  {
    text: "The wisdom hits different when you need it most. It's like having Marcus Aurelius in your pocket.",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    name: "Michael K.",
    role: "Entrepreneur",
  },
  {
    text: "Finally, an app that doesn't make me feel like I'm being sold something. It just... helps.",
    image: "https://randomuser.me/api/portraits/women/35.jpg",
    name: "Priya S.",
    role: "Therapist",
  },
  {
    text: "It's not about productivity or optimization. It's about being human. I love that.",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    name: "David R.",
    role: "Teacher",
  },
  {
    text: "Memento doesn't judge my thoughts — it just holds space for them. That's healing.",
    image: "https://randomuser.me/api/portraits/women/37.jpg",
    name: "Elena M.",
    role: "Writer",
  },
  {
    text: "The daily reflections feel like conversations with my wisest friend. Genuinely life-changing.",
    image: "https://randomuser.me/api/portraits/men/38.jpg",
    name: "Carlos V.",
    role: "Coach",
  },
  {
    text: "It's the antidote to digital noise. Simple, profound, exactly what I needed without knowing it.",
    image: "https://randomuser.me/api/portraits/women/39.jpg",
    name: "Jessica T.",
    role: "Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsSection = () => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
