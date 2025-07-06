
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, BarChart, Calendar, BookOpenText } from 'lucide-react';

interface CardData {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const cardData: CardData[] = [
  {
    title: "MarcusGPT",
    description: "A Stoic AI that helps you reflect wisely, powered by GPT-4.",
    icon: MessageCircle,
  },
  {
    title: "Virtue Tracker",
    description: "Log your actions daily and track how well you're living your values.",
    icon: BarChart,
  },
  {
    title: "Memento Mori",
    description: "A visual countdown of your weeks, to stay mindful of time.",
    icon: Calendar,
  },
  {
    title: "Stoic Journal",
    description: "A guided journal to help you write, reflect, and stay grounded.",
    icon: BookOpenText,
  }
];

const ModernOperatingCards: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {cardData.map((card, index) => (
        <motion.div
          key={card.title}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02,
            y: -4,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          className="group relative"
        >
          {/* Main card */}
          <div className="relative p-8 rounded-3xl bg-white border border-gray-200/50 transition-all duration-300 hover:border-gray-300/80 overflow-hidden">
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200/20 via-gray-100/40 to-gray-200/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                  <card.icon className="w-7 h-7 text-gray-700" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                {card.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ModernOperatingCards;
