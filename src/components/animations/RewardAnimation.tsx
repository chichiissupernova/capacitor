
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';

// Confetti component
export const Confetti = () => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  
  // Generate confetti pieces when component mounts
  useEffect(() => {
    const colors = ['#FF5C28', '#FFC107', '#9b87f5', '#33C3F0', '#D946EF'];
    const numParticles = 30;
    const newParticles = [];
    
    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.2;
      const duration = Math.random() * 1 + 1;
      const scale = Math.random() * 1 + 0.5;
      
      newParticles.push(
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            y: [0, -100 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 360],
            scale: [0, scale],
            opacity: [1, 0],
          }}
          transition={{
            duration: duration,
            delay: delay,
            ease: "easeOut"
          }}
        />
      );
    }
    
    setParticles(newParticles);
  }, []);
  
  return <>{particles}</>;
};

interface RewardAnimationProps {
  points?: number;
  badgeUnlocked?: string;
  onComplete?: () => void;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({ 
  points = 10, 
  badgeUnlocked, 
  onComplete 
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Hide after animation completes
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            {/* Confetti effect */}
            <Confetti />
            
            {/* Points pop-up */}
            <motion.div
              className="bg-gradient-to-br from-chichi-orange to-[#FF8A50] text-white font-bold py-3 px-6 rounded-full shadow-lg pointer-events-none"
              initial={{ scale: 0.5, y: 20, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
              exit={{ scale: 1.2, opacity: 0 }}
            >
              +{points} Points!
            </motion.div>
            
            {/* Badge animation (if unlocked) */}
            {badgeUnlocked && (
              <motion.div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 flex flex-col items-center"
                initial={{ scale: 0.5, y: -10, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    delay: 0.3, 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full opacity-75 blur-sm animate-pulse"></div>
                  <div className="relative bg-white p-3 rounded-full">
                    <Award className="text-yellow-500 h-8 w-8" />
                  </div>
                </div>
                <span className="mt-2 text-sm font-medium text-white bg-black/50 px-3 py-1 rounded-full">
                  {badgeUnlocked} Unlocked!
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
