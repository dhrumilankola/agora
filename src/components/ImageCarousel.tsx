'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { TopicImage } from '@/app/data/topics';
import { ChevronUpIcon, ChevronDownIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageCarouselProps {
  images: TopicImage[];
  focusedIndex?: number;
  onImageChange?: (index: number) => void;
  className?: string;
}

export default function ImageCarousel({
  images,
  focusedIndex = 0,
  onImageChange,
  className = ''
}: ImageCarouselProps) {
  const [showContext, setShowContext] = useState(false);

  const currentIndex = focusedIndex;

  const navigateUp = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onImageChange?.(newIndex);
  };

  const navigateDown = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onImageChange?.(newIndex);
  };

  const handleImageClick = (index: number) => {
    onImageChange?.(index);
  };

  if (images.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-2">
        <motion.button
          onClick={navigateUp}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUpIcon className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={navigateDown}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="relative w-80 h-96 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].context}
              className="object-cover !opacity-100"
              fill
              sizes="320px"
              priority={true}
              quality={85}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={() => setShowContext(!showContext)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <InformationCircleIcon className="w-4 h-4" />
        </motion.button>

        <AnimatePresence>
          {showContext && (
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-between p-6 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-end">
                <motion.button
                  onClick={() => setShowContext(false)}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="text-white">
                <p className="text-sm leading-relaxed mb-4">
                  {images[currentIndex].context}
                </p>
                <div className="flex flex-wrap gap-1">
                  {images[currentIndex].keywords.slice(0, 4).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleImageClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
                }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex space-x-2 overflow-hidden">
        {images.map((image, index) => (
          <motion.div
            key={`thumb-${index}`}
            className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer ${index === currentIndex ? 'ring-2 ring-white/80' : ''
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={image.src}
              alt={image.context}
              className={`object-cover !opacity-100 transition-opacity ${index === currentIndex ? '' : 'hover:!opacity-100'}`}
              fill
              sizes="64px"
              quality={60}
              loading="eager"
            />
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 border-2 border-white/80 rounded-lg"
                layoutId="activeImageBorder"
              />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-white/50 text-xs">
          Try asking: "Tell me about {images[currentIndex].keywords[0]}"
        </p>
      </motion.div>
    </div>
  );
}