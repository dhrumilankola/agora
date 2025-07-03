'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { UserIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface TranscriptItem {
  role: 'user' | 'agent';
  message: string;
  timestamp: Date;
}

interface TranscriptViewProps {
  transcript?: TranscriptItem[];
  className?: string;
}

export default function TranscriptView({ transcript = [], className = '' }: TranscriptViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className={`flex flex-col h-96 ${className}`}>
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-lg flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2 text-purple-400" />
          Conversation
        </h3>
        <p className="text-white/60 text-sm mt-1">
          {transcript.length === 0
            ? 'Your conversation will appear here'
            : `${transcript.length} message${transcript.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 backdrop-blur-sm rounded-b-lg"
      >
        {transcript.length === 0 ? (
          <motion.div
            className="flex items-center justify-center h-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-white/40">
              <SparklesIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start talking to see your conversation here</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {transcript.map((item, index) => (
              <TranscriptMessage
                key={index}
                item={item}
                index={index}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

interface TranscriptMessageProps {
  item: TranscriptItem;
  index: number;
}

function TranscriptMessage({ item, index }: TranscriptMessageProps) {
  const isUser = item.role === 'user';

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
          ? 'bg-blue-500/20 border border-blue-400/30'
          : 'bg-purple-500/20 border border-purple-400/30'
          }`}>
          {isUser ? (
            <UserIcon className="w-4 h-4 text-blue-400" />
          ) : (
            <SparklesIcon className="w-4 h-4 text-purple-400" />
          )}
        </div>

        <div className={`relative px-4 py-3 rounded-2xl ${isUser
          ? 'bg-blue-500/20 text-blue-100 rounded-br-md border border-blue-400/20'
          : 'bg-white/10 text-white rounded-bl-md border border-white/10'
          }`}>
          <p className="text-sm leading-relaxed">
            {item.message}
          </p>

          <p className={`text-xs mt-2 ${isUser ? 'text-blue-300/70' : 'text-white/50'
            }`}>
            {formatTime(item.timestamp)}
          </p>

          <div className={`absolute bottom-0 w-3 h-3 ${isUser
            ? 'right-0 transform translate-x-1 translate-y-1 bg-blue-500/20 border-r border-b border-blue-400/20'
            : 'left-0 transform -translate-x-1 translate-y-1 bg-white/10 border-l border-b border-white/10'
            } rotate-45`} />
        </div>
      </div>
    </motion.div>
  );
}