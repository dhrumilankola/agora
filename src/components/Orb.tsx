'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'disconnected';

interface OrbProps {
  state?: OrbState;
  onClick?: () => void;
  className?: string;
}

export default function Orb({ state = 'idle', onClick, className = '' }: OrbProps) {
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    setPulseKey(prev => prev + 1);
  }, [state]);

  const getOrbConfig = (state: OrbState) => {
    switch (state) {
      case 'listening':
        return {
          size: 160,
          color: 'from-green-400 to-emerald-500',
          glow: 'shadow-green-400/50',
          pulse: true,
          rings: 3,
          description: 'Listening...'
        };
      case 'thinking':
        return {
          size: 140,
          color: 'from-yellow-400 to-orange-500',
          glow: 'shadow-yellow-400/50',
          pulse: false,
          rings: 2,
          description: 'Thinking...'
        };
      case 'speaking':
        return {
          size: 180,
          color: 'from-purple-500 to-pink-500',
          glow: 'shadow-purple-400/50',
          pulse: true,
          rings: 4,
          description: 'Speaking...'
        };
      case 'disconnected':
        return {
          size: 100,
          color: 'from-gray-400 to-gray-600',
          glow: 'shadow-gray-400/30',
          pulse: false,
          rings: 0,
          description: 'Disconnected'
        };
      default:
        return {
          size: 120,
          color: 'from-blue-400 to-indigo-500',
          glow: 'shadow-blue-400/40',
          pulse: false,
          rings: 1,
          description: 'Ready to talk'
        };
    }
  };

  const config = getOrbConfig(state);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {Array.from({ length: config.rings }).map((_, index) => (
            <motion.div
              key={`${pulseKey}-ring-${index}`}
              className={`absolute rounded-full border-2 border-white/20`}
              initial={{
                width: config.size,
                height: config.size,
                opacity: 0.8,
                scale: 1
              }}
              animate={{
                width: config.size + (index + 1) * 40,
                height: config.size + (index + 1) * 40,
                opacity: 0,
                scale: 1.5
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: config.pulse ? Infinity : 0,
                ease: "easeOut"
              }}
            />
          ))}
        </AnimatePresence>

        <motion.div
          className={`relative rounded-full cursor-pointer bg-gradient-to-br ${config.color} ${config.glow} shadow-2xl`}
          style={{
            width: config.size,
            height: config.size,
          }}
          animate={{
            scale: state === 'speaking' ? [1, 1.1, 1] : 1,
            rotate: state === 'thinking' ? 360 : 0,
          }}
          transition={{
            scale: {
              duration: 0.6,
              repeat: state === 'speaking' ? Infinity : 0,
              ease: "easeInOut"
            },
            rotate: {
              duration: 2,
              repeat: state === 'thinking' ? Infinity : 0,
              ease: "linear"
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
        >
          <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm" />

          <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-3 h-3 rounded-full bg-white/80"
              animate={{
                scale: state === 'listening' ? [1, 1.5, 1] : 1,
                opacity: state === 'disconnected' ? 0.3 : 0.8,
              }}
              transition={{
                duration: 1,
                repeat: state === 'listening' ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          </div>

          {state === 'speaking' && (
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={`particle-${index}`}
                  className="absolute w-2 h-2 rounded-full bg-white/60"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(index * 45 * Math.PI / 180) * 60],
                    y: [0, Math.sin(index * 45 * Math.PI / 180) * 60],
                    opacity: [0.8, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.p
        className="mt-6 text-white/80 text-sm font-medium"
        key={state}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {config.description}
      </motion.p>

      {state === 'idle' && onClick && (
        <motion.p
          className="mt-2 text-white/50 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Click to start conversation
        </motion.p>
      )}
    </div>
  );
}