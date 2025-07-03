'use client';

import { useState, useEffect, useCallback } from 'react';
import { Topic, findRelevantImage, Persona } from '@/app/data/topics';

import { useConversation as useElevenLabsConversation } from '@elevenlabs/react';

export interface TranscriptItem {
  role: 'user' | 'agent';
  message: string;
  timestamp: Date;
}

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'disconnected';
interface UseConversationReturn {
  isConnected: boolean;
  orbState: OrbState;
  transcript: TranscriptItem[];
  error: string | null;
  startConversation: () => Promise<void>;
  stopConversation: () => void;
  currentImageIndex: number;
  persona: Persona | null;
  documentId: string | null;
}

export function useConversation(topic: Topic): UseConversationReturn {
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const {
    status,
    startSession,
    endSession,
    isSpeaking,
  } = useElevenLabsConversation({
    // Using 'any' for the message type since the SDK doesn't export it.
    onMessage: (message: any) => {
      // Debug logging to help with troubleshooting
      console.log('WebSocket message received:', message);
      
      // Extract user and agent text based on the source field
      const userTranscript: string | undefined =
        (message.source === 'user' && message.message) ? message.message :
        message.user_transcription_event?.user_transcript ??
        message.transcript;

      const agentResponse: string | undefined =
        (message.source === 'ai' && message.message) ? message.message :
        message.agent_response_event?.agent_response ??
        message.response;

      // If we found a user transcript, append it
      if (userTranscript) {
        console.log('Adding user transcript:', userTranscript);
        setTranscript(prev => [
          ...prev,
          {
            role: 'user',
            message: userTranscript,
            timestamp: new Date(),
          },
        ]);

        // Update carousel image, if relevant
        const relevantImage = findRelevantImage(topic.id, userTranscript);
        if (relevantImage) {
          const imageIndex = topic.images.findIndex(
            img => img.src === relevantImage.src
          );
          if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
        }
      }

      // If we found an agent response, append it
      if (agentResponse) {
        console.log('Adding agent response:', agentResponse);
        setTranscript(prev => [
          ...prev,
          {
            role: 'agent',
            message: agentResponse,
            timestamp: new Date(),
          },
        ]);
      }
    },
    onError: (err) => {
      console.error("ElevenLabs SDK Error:", err);
      setError("An error occurred with the conversation service.");
    },
  });

  // Effect to map the SDK's state to our custom OrbState
  useEffect(() => {
    if (status === 'connected') {
      if (isSpeaking) {
        setOrbState('speaking');
      } else {
        const lastMessage = transcript[transcript.length - 1];
        if (lastMessage?.role === 'user') {
            setOrbState('thinking');
        } else {
            setOrbState('listening');
        }
      }
    } else if (status === 'connecting') {
      setOrbState('thinking');
    } else if (status === 'disconnected') {
      setOrbState('idle');
    }
  }, [status, isSpeaking, transcript]);

  const startConversation = useCallback(async () => {
    setError(null);
    setOrbState('thinking');
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: topic.id }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to get signed URL for conversation.');
      }
      
      const { signedUrl, agentId, persona, documentId } = await response.json();
      
      // Store persona and document ID for UI display
      setPersona(persona);
      setDocumentId(documentId);

      console.log(`Starting conversation with knowledge base document: ${documentId}`);
      console.log(`Using topic-specific configuration for ${topic.title}`);

      setOrbState('thinking');

      // Start the WebSocket session with conversation overrides
      await startSession({ 
        signedUrl,
        overrides: {
          // Switch the TTS voice to the topic-specific persona voice
          tts: { 
            voiceId: topic.persona.voiceId 
          },
          // Provide the custom topic-specific configuration
          agent: {
            firstMessage: topic.dynamicFirstMessage,
            prompt: {
              prompt: topic.dynamicSystemPrompt,
              knowledge_base: [
                {
                  type: "file",
                  name: topic.title,
                  id: topic.documentId,
                  usage_mode: "auto"
                }
              ],
              rag: {
                enabled: true,
                embedding_model: "e5_mistral_7b_instruct",
                max_vector_distance: 0.6,
                max_documents_length: 50000,
                max_retrieved_rag_chunks_count: 20
              }
            } as any
          }
        }
      });

    } catch (err) {
      console.error("Failed to start conversation:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setOrbState('disconnected');
    }
  }, [startSession, topic]);

  const stopConversation = useCallback(async () => {
    setOrbState('idle');
    await endSession();
  }, [endSession]);

  return {
    isConnected: status === 'connected',
    orbState,
    transcript,
    error,
    startConversation,
    stopConversation,
    currentImageIndex,
    persona,
    documentId,
  };
}