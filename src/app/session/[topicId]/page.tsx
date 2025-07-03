import { notFound } from 'next/navigation';
import { getTopicById } from '@/app/data/topics';
import VoiceSession from '@/components/VoiceSession';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    topicId: string;
  }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${topic.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        <VoiceSession topic={topic} />
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  return {
    title: `Agora - ${topic.title}`,
    description: topic.summary,
  };
}