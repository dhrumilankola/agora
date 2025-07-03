'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { topics } from '@/app/data/topics';
import { ArrowRightIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';

export default function TopicSelection() {
  const router = useRouter();

  const handleTopicSelect = (topicId: string) => {
    router.push(`/session/${topicId}`);
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center mb-6">
          <SparklesIcon className="w-8 h-8 text-purple-400 mr-3" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Agora
          </h1>
          <SparklesIcon className="w-8 h-8 text-purple-400 ml-3" />
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Choose your learning adventure. Dive into immersive conversations with AI experts,
          where knowledge comes alive through voice and vision.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              onSelect={() => handleTopicSelect(topic.id)}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p className="text-gray-400 text-sm">
          Powered by ElevenLabs Conversational AI • Voice-First Learning
        </p>
      </motion.div>
    </div>
  );
}

interface TopicCardProps {
  topic: typeof topics[0];
  index: number;
  onSelect: () => void;
}

function TopicCard({ topic, index, onSelect }: TopicCardProps) {
  const thumbnailUrl = topic.backgroundImage;
  const snippet = topic.summary.slice(0, 100) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl transition-all duration-300 group-hover:border-white/40 group-hover:shadow-purple-500/20">
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <motion.div
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRightIcon className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
            {topic.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {snippet}
          </p>
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-300/20">
            <div className="flex items-center space-x-2 mb-2">
              <UserIcon className="w-4 h-4 text-purple-300" />
              <span className="text-purple-300 font-medium text-sm">Meet Your Guide</span>
            </div>
            <div className="text-white font-semibold">{topic.persona.name}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {topic.persona.traits.slice(0, 3).map((trait, idx) => (
                <span key={idx} className="text-xs text-purple-200 bg-purple-400/20 px-2 py-0.5 rounded-full">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}