import path from "node:path";

export const CONTENT_DIR = path.join(process.cwd(), "documents");
export const CACHE_PREFIX = "tts";
export const DEFAULT_VOICE = "en-US-GuyNeural";

export const AVAILABLE_VOICES = [
  { id: "en-US-GuyNeural", label: "Guy (US Male)" },
  { id: "en-US-JennyNeural", label: "Jenny (US Female)" },
  { id: "en-US-AriaNeural", label: "Aria (US Female)" },
  { id: "en-GB-RyanNeural", label: "Ryan (British Male)" },
  { id: "en-GB-SoniaNeural", label: "Sonia (British Female)" },
  { id: "en-AU-NatashaNeural", label: "Natasha (Australian Female)" },
  { id: "en-AU-WilliamNeural", label: "William (Australian Male)" },
  { id: "en-IN-NeerjaNeural", label: "Neerja (Indian Female)" },
  { id: "en-IN-PrabhatNeural", label: "Prabhat (Indian Male)" },
] as const;

export type VoiceId = (typeof AVAILABLE_VOICES)[number]["id"];
