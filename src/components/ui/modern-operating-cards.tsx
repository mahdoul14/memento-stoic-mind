
"use client";

import { motion } from "framer-motion";
import { MessageCircle, BarChart3, Clock, BookOpen } from "lucide-react";

const ModernOperatingCards = () => {
  const tools = [
    {
      icon: MessageCircle,
      title: "MarcusGPT",
      description: "A Stoic AI that helps you reflect wisely, powered by GPT-4.",
      gradient: "from-blue-500/10 to-purple-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Virtue Tracker",
      description: "Log your actions daily and track how well you're living your values.",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-600",
    },
    {
      icon: Clock,
      title: "Memento Mori",
      description: "A visual countdown of your weeks, to stay mindful of time.",
      gradient: "from-orange-500/10 to-red-500/10",
      iconColor: "text-orange-600",
    },
    {
      icon: BookOpen,
      title: "Stoic Journal",
      description: "A guided journal to help you write, reflect, and stay grounded.",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
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
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.title}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="group relative bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 border border-gray-100/50"
          >
            {/* Subtle gradient background on hover */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-3xl bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white/80 transition-colors duration-300">
                  <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
              </div>
              
              <h3 className="font-semibold text-xl text-gray-900 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                {tool.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {tool.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ModernOperatingCards;
