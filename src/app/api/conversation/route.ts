import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';
import { topics } from '@/app/data/topics';

interface ConversationRequest {
  topicId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { topicId }: ConversationRequest = await request.json();

    if (!topicId) {
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      );
    }

    const agentId = process.env.ELEVENLABS_AGENT_ID;

    if (!agentId) {
      return NextResponse.json(
        { error: 'ElevenLabs agent ID not configured' },
        { status: 500 }
      );
    }

    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    try {
      const client = new ElevenLabsClient();
      
      console.log('Creating signed URL for topic:', topicId);
      console.log('Topic configuration:', {
        persona: topic.persona.name,
        voiceId: topic.persona.voiceId,
        documentId: topic.documentId,
        hasCustomFirstMessage: !!topic.dynamicFirstMessage,
        hasCustomPrompt: !!topic.dynamicSystemPrompt
      });
      
      const response = await client.conversationalAi.getSignedUrl({
        agent_id: agentId
      });

      return NextResponse.json({
        signedUrl: response.signed_url,
        agentId,
        topicId,
        documentId: topic.documentId,
        persona: topic.persona
      });
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      return NextResponse.json(
        { error: 'Failed to get signed URL' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Conversation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    hasApiKey: !!process.env.ELEVENLABS_API_KEY,
    hasAgentId: !!process.env.ELEVENLABS_AGENT_ID
  });
}