import TopicSelection from '@/components/TopicSelection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agora - Voice-First Learning',
  description: 'Immersive voice conversations with AI experts',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <TopicSelection />
    </main>
  );
}