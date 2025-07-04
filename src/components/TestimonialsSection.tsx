
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Memento doesn't push me to hustle. It invites me to reflect. That's something I've needed for a long time.",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    name: "Ava Tran",
    role: "Creative Director",
  },
  {
    text: "There's something sacred about having a space that slows you down. Memento is that space for me.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "James Elmi",
    role: "Founder",
  },
  {
    text: "I've tried every journaling app — this is the only one that actually makes me want to write every day.",
    image: "https://randomuser.me/api/portraits/women/23.jpg",
    name: "Zara Mahmoud",
    role: "Therapist",
  },
  {
    text: "It feels like an operating system for stillness. Quiet, clear, focused — exactly what I need in this chaos.",
    image: "https://randomuser.me/api/portraits/men/24.jpg",
    name: "Leo S.",
    role: "Product Manager",
  },
  {
    text: "Memento has made philosophy practical. I carry Stoicism into my day, not just my thoughts.",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
    name: "Yasmin D.",
    role: "Poet",
  },
  {
    text: "It doesn't gamify reflection. It respects it. That's rare in tech.",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    name: "Chloe Kim",
    role: "Coach",
  },
  {
    text: "It's not just a tool. It's a companion. It helps me return to myself.",
    image: "https://randomuser.me/api/portraits/men/27.jpg",
    name: "Daniel R.",
    role: "Writer",
  },
  {
    text: "This app is what journaling should feel like: peaceful, guided, and beautifully human.",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    name: "Maya N.",
    role: "Psychologist",
  },
  {
    text: "It's rare to find a product that feels like it was made with care. Memento feels like care.",
    image: "https://randomuser.me/api/portraits/men/29.jpg",
    name: "Ben C.",
    role: "Designer",
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
