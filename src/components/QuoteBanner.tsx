
import { Hourglass } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const QuoteBanner = () => {
  return (
    <section className="relative bg-white py-16 lg:py-24 overflow-hidden">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-50/50 via-white to-white" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Animated Hourglass Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-4 rounded-full bg-gradient-to-b from-gray-100 to-gray-50 shadow-lg"
            >
              <Hourglass className="w-8 h-8 text-gray-700" />
            </motion.div>
          </motion.div>

          {/* Quote with elegant typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-gray-900 font-medium italic leading-relaxed tracking-wide">
              "You could leave life right now. Let that determine what you do and say and think."
            </blockquote>
          </motion.div>

          {/* Author attribution with delay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <cite className="font-inter text-lg md:text-xl text-gray-600 font-medium not-italic">
              — Marcus Aurelius
            </cite>
          </motion.div>

          {/* Call to action button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-base font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Begin your practice
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default QuoteBanner;
