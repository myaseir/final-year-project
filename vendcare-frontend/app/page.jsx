'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Droplets } from 'lucide-react';

// Animation Variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function VendCarePage() {
  return (
    <div className="h-screen w-full flex flex-col bg-transparent text-[#4A3F3F] font-sans overflow-hidden relative">
      
      {/* Aesthetic Background Theme Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#FFF5F5_0%,_transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#F9EAEA_0%,_transparent_30%)] pointer-events-none" />

      {/* Wrapping in AnimatePresence for exit transitions */}
      <AnimatePresence mode="wait">
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6">
          
          {/* Titles Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white border border-[#F9EAEA] shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E29595]">Experience Luxury</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-4 tracking-tight">
              Welcome to <span className="font-bold not-italic text-[#E29595]">VendCare.</span>
            </h1>
            <h2 className="text-sm md:text-base text-[#8C7A7A] font-medium tracking-[0.2em] uppercase opacity-80">
              Curated Beauty & Hygiene • Instant Dispense
            </h2>
          </motion.div>

          {/* Product Selection Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12 w-full max-w-6xl"
          >
            
            {/* Card 1: Perfumes */}
            <motion.div variants={itemVariants}>
              <Link href="/selection/perfumes" className="group block w-[280px] h-[340px] bg-white border border-[#F9EAEA] rounded-[3.5rem] shadow-sm relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(216,167,185,0.25)]">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-full flex flex-col items-center justify-center p-8"
                >
                  <div className="w-24 h-24 rounded-[2.2rem] bg-[#fff5f8] flex items-center justify-center mb-8 group-hover:bg-[#d8a7b9] transition-all duration-500 shadow-inner">
                    <Sparkles size={40} strokeWidth={1} className="text-[#d8a7b9] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif italic font-bold mb-2">Perfumes</h3>
                  <p className="text-[#8C7A7A] text-[10px] font-bold uppercase tracking-[0.25em]">Signature Scents</p>
                </motion.div>
              </Link>
            </motion.div>
          
            {/* Card 2: Moisturizers */}
            <motion.div variants={itemVariants}>
              <Link href="/selection/moisturizers" className="group block w-[280px] h-[340px] bg-white border border-[#F9EAEA] rounded-[3.5rem] shadow-sm relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(167,199,216,0.25)]">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-full flex flex-col items-center justify-center p-8"
                >
                  <div className="w-24 h-24 rounded-[2.2rem] bg-[#f5fbff] flex items-center justify-center mb-8 group-hover:bg-[#a7c7d8] transition-all duration-500 shadow-inner">
                    <Droplets size={40} strokeWidth={1} className="text-[#a7c7d8] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif italic font-bold mb-2">Moisturizers</h3>
                  <p className="text-[#8C7A7A] text-[10px] font-bold uppercase tracking-[0.25em]">Hydrate Your Glow</p>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Card 3: Sunscreens */}
            <motion.div variants={itemVariants}>
              <Link href="/selection/sunscreens" className="group block w-[280px] h-[340px] bg-white border border-[#F9EAEA] rounded-[3.5rem] shadow-sm relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(216,188,167,0.25)]">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-full flex flex-col items-center justify-center p-8"
                >
                  <div className="w-24 h-24 rounded-[2.2rem] bg-[#fffcf5] flex items-center justify-center mb-8 group-hover:bg-[#d8bca7] transition-all duration-500 shadow-inner">
                    <Sun size={40} strokeWidth={1} className="text-[#d8bca7] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif italic font-bold mb-2">Sunscreens</h3>
                  <p className="text-[#8C7A7A] text-[10px] font-bold uppercase tracking-[0.25em]">Daily Protection</p>
                </motion.div>
              </Link>
            </motion.div>

          </motion.div>

          {/* Interactive Prompt */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center"
          >
            <motion.p 
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-[10px] font-bold text-[#4A3F3F] uppercase tracking-[0.5em]"
            >
              Please Select a Category to Begin
            </motion.p>
          </motion.div>

        </main>
      </AnimatePresence>

      {/* Decorative Breathing Corner Element */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.15, 0.05] 
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-[#F3C5C5] rounded-full blur-3xl pointer-events-none" 
      />
    </div>
  );
}