import path from "node:path";

export const CONTENT_DIR = path.join(process.cwd(), "documents");
export const CACHE_PREFIX = "tts";

/**
 * TTS Provider: ElevenLabs
 *
 * Cost optimization:
 * - Single voice via ELEVENLABS_VOICE_ID env var
 * - Flash v2.5 model: 50% cheaper than Multilingual v2
 * - Pre-generation only: no on-demand API calls
 */
export const TTS_PROVIDER = "elevenlabs" as const;
