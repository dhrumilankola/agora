'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Topic } from '@/app/data/topics';
import { useConversation } from '@/hooks/useConversation';
import Orb from './Orb';
import ImageCarousel from './ImageCarousel';
import TranscriptView from './TranscriptView';
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface VoiceSessionProps {
  topic: Topic;
}

export default function VoiceSession({ topic }: VoiceSessionProps) {
  const router = useRouter();
  const [showTranscript, setShowTranscript] = useState(false);
  const {
    isConnected,
    orbState,
    transcript,
    error,
    startConversation,
    stopConversation,
    currentImageIndex,
    persona,
  } = useConversation(topic);

  const [focusedImageIndex, setFocusedImageIndex] = useState(0);
  const [isManuallyControlled, setIsManuallyControlled] = useState(false);

  useEffect(() => {
    if (!isManuallyControlled) {
      setFocusedImageIndex(currentImageIndex);
    }
  }, [currentImageIndex, isManuallyControlled]);

  const handleImageChange = (index: number) => {
    setFocusedImageIndex(index);
    setIsManuallyControlled(true);

    setTimeout(() => {
      setIsManuallyControlled(false);
    }, 10000);
  };

  const handleOrbClick = async () => {
    if (isConnected) {
      stopConversation();
    } else {
      await startConversation();
    }
  };

  const handleBack = () => {
    if (isConnected) {
      stopConversation();
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        className="relative z-30 p-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={handleBack}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Topics</span>
        </motion.button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            {topic.title}
          </h1>
          {persona && (
            <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
              <UserIcon className="w-4 h-4" />
              <span>with {persona.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              {showTranscript ? 'Hide' : 'Show'} Conversation
            </span>
          </motion.button>
        </div>
      </motion.header>

      {persona && (
        <motion.div
          className="relative z-20 mx-6 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{persona.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {persona.traits.map((trait, idx) => (
                      <span key={idx} className="text-xs text-purple-200 bg-purple-400/20 px-2 py-0.5 rounded-full">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div className={`flex items-start justify-center max-w-7xl w-full transition-all duration-500 ${showTranscript ? 'space-x-24' : 'space-x-32'
          }`}>

          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ImageCarousel
              images={topic.images}
              focusedIndex={focusedImageIndex}
              onImageChange={handleImageChange}
            />
          </motion.div>

          <motion.div
            className="flex-shrink-0 self-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: showTranscript ? 0 : 60
            }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Orb
              state={orbState}
              onClick={handleOrbClick}
              className="mx-12"
            />
          </motion.div>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <TranscriptView
                  transcript={transcript}
                  className="w-96 h-[500px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur text-white px-6 py-3 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className="text-sm font-medium">Error: {error}</p>
        </motion.div>
      )}

      <motion.div
        className="relative z-30 px-6 py-4 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-center space-x-4 text-white/60 text-sm">
          <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>

          {transcript.length > 0 && (
            <>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span>{transcript.length} message{transcript.length !== 1 ? 's' : ''}</span>
            </>
          )}

          {persona && (
            <>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span>Voice: {persona.name}</span>
            </>
          )}

          <div className="w-1 h-1 rounded-full bg-white/30" />
          <span>Powered by ElevenLabs</span>
        </div>
      </motion.div>
    </div>
  );
}