
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Globe, Zap, Shield } from 'lucide-react';

interface CardData {
  title: string;
  description: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const cardData: CardData[] = [
  {
    title: "MarcusGPT",
    tagline: "Converse with ancient wisdom. Get modern clarity.",
    description: "Ask life's hardest questions. Get answers from the Stoics. Built with GPT-4, fine-tuned to think like Marcus Aurelius.",
    icon: Brain,
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Memento Mori",
    tagline: "A visual reminder of your mortality — and your purpose.",
    description: "Track your life in weeks. Each dot reminds you to live with urgency, intention, and grace.",
    icon: Globe,
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Stoic Journal",
    tagline: "Reflect. Accept. Improve.",
    description: "Capture your thoughts each day. Practice morning intention and evening reflection, just like the Stoics.",
    icon: Zap,
    gradient: "from-amber-500/20 to-orange-500/20"
  },
  {
    title: "Virtue Tracker",
    tagline: "Measure yourself by what matters.",
    description: "Daily reflections on courage, temperance, wisdom, and justice. Let your actions show your growth.",
    icon: Shield,
    gradient: "from-emerald-500/20 to-teal-500/20"
  }
];

const ModernOperatingCards: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {cardData.map((card, index) => (
        <motion.div
          key={card.title}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02,
            y: -5,
            transition: { duration: 0.3, type: "spring", stiffness: 400 }
          }}
          className="group relative"
        >
          {/* Glass card with backdrop blur */}
          <div className="relative p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/80">
            {/* Gradient overlay */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <card.icon className="w-8 h-8 text-gray-700" />
                </div>
              </div>

              {/* Tagline */}
              <p className="text-sm font-medium text-gray-500 mb-2 group-hover:text-gray-600 transition-colors duration-300">
                {card.tagline}
              </p>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {card.description}
              </p>

              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ModernOperatingCards;
