/**
 * ElevenLabs TTS integration - optimized for cost
 *
 * Cost-saving strategies:
 * - Flash v2.5 model: 50% cheaper than Multilingual v2
 * - mp3_22050_32: smallest file size, low bandwidth
 * - Pre-generation only: no on-demand API calls
 * - Single voice: one great voice vs many
 *
 * Pricing (as of 2026):
 * - Free: 10k credits/month (~20 minutes)
 * - Starter ($5/mo): 30k credits (~60 minutes)
 * - Flash v2.5: 50% lower cost per character
 */

import { normalizeWord } from "@/lib/utils/strings";
import type { WordTimestamp } from "./alignment";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Flash v2.5 is 50% cheaper than Multilingual v2
const MODEL_ID = "eleven_flash_v2_5";

// Smallest file size for lowest bandwidth costs
const OUTPUT_FORMAT = "mp3_22050_32";

export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
}

interface ElevenLabsTimestampResponse {
  audio_base64: string;
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  } | null;
  normalized_alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  } | null;
}

function getConfig(): ElevenLabsConfig {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY environment variable is not set");
  }
  if (!voiceId) {
    throw new Error("ELEVENLABS_VOICE_ID environment variable is not set");
  }

  return { apiKey, voiceId };
}

/**
 * Convert character-level timestamps to word-level timestamps
 */
function alignmentToWordTimestamps(
  alignment: ElevenLabsTimestampResponse["alignment"],
  originalText: string,
): WordTimestamp[] {
  if (!alignment) {
    return createEstimatedTimestamps(originalText);
  }

  const {
    characters,
    character_start_times_seconds,
    character_end_times_seconds,
  } = alignment;
  const timestamps: WordTimestamp[] = [];

  let wordStart = -1;
  let wordEnd = -1;
  let currentWord = "";

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const startTime = character_start_times_seconds[i];
    const endTime = character_end_times_seconds[i];

    // Check if this character is whitespace or punctuation that ends a word
    const isWordBoundary = /[\s.,!?;:'"()[\]{}\-—–]/.test(char);

    if (isWordBoundary) {
      // End current word if we have one
      if (currentWord.length > 0 && wordStart >= 0) {
        const normalized = normalizeWord(currentWord);
        if (normalized) {
          timestamps.push({
            word: currentWord,
            start: wordStart,
            end: wordEnd,
            normalized,
          });
        }
      }
      currentWord = "";
      wordStart = -1;
      wordEnd = -1;
    } else {
      // Add to current word
      if (wordStart < 0) {
        wordStart = startTime;
      }
      wordEnd = endTime;
      currentWord += char;
    }
  }

  // Don't forget the last word
  if (currentWord.length > 0 && wordStart >= 0) {
    const normalized = normalizeWord(currentWord);
    if (normalized) {
      timestamps.push({
        word: currentWord,
        start: wordStart,
        end: wordEnd,
        normalized,
      });
    }
  }

  return timestamps;
}

function createEstimatedTimestamps(text: string): WordTimestamp[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  // Estimate ~150 words per minute for natural speech
  const wordsPerSecond = 150 / 60;
  const avgWordDuration = 1 / wordsPerSecond;

  const timestamps: WordTimestamp[] = [];
  let currentTime = 0;

  for (const word of words) {
    const normalized = normalizeWord(word);
    if (!normalized) continue;

    const duration = avgWordDuration * (word.length / 5);

    timestamps.push({
      word,
      start: currentTime,
      end: currentTime + duration,
      normalized,
    });

    currentTime += duration;
  }

  return timestamps;
}

/**
 * Synthesize speech using ElevenLabs API with timestamps
 * Uses the "with-timestamps" endpoint for word-level synchronization
 */
export async function synthesizeSpeechElevenLabs(
  text: string,
): Promise<{ audioBuffer: Buffer; timestamps: WordTimestamp[] }> {
  const config = getConfig();

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${config.voiceId}/with-timestamps?output_format=${OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        // Optimize for quality and consistency
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(
      `ElevenLabs API error: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const data = (await response.json()) as ElevenLabsTimestampResponse;

  // Decode base64 audio to buffer
  const audioBuffer = Buffer.from(data.audio_base64, "base64");

  // Convert character-level alignment to word timestamps
  const timestamps = alignmentToWordTimestamps(
    data.normalized_alignment ?? data.alignment,
    text,
  );

  return { audioBuffer, timestamps };
}

/**
 * Get available quota information
 */
export async function getQuotaInfo(): Promise<{
  characterCount: number;
  characterLimit: number;
  remainingCharacters: number;
}> {
  const config = getConfig();

  const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
    headers: {
      "xi-api-key": config.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get quota info: ${response.status}`);
  }

  const data = await response.json();
  return {
    characterCount: data.character_count ?? 0,
    characterLimit: data.character_limit ?? 0,
    remainingCharacters:
      (data.character_limit ?? 0) - (data.character_count ?? 0),
  };
}
