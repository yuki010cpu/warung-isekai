import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, the GoogleGenAI client is initialized directly.
// The API key is assumed to be available in `process.env.API_KEY`.
// Conditional checks for the API key have been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (text: string): Promise<string> => {
  // Removed the !ai check as it's now guaranteed to be initialized.
  if (!text) {
    return "Tidak ada sinopsis.";
  }

  try {
    const prompt = `Translate the following anime synopsis to Indonesian. Keep the tone engaging and appropriate for an anime description. Do not add any extra commentary or introductory phrases like "Berikut terjemahannya:". Just provide the translated text directly.\n\nSynopsis:\n"""\n${text}\n"""`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const translatedText = response.text.trim();
    return translatedText;
  } catch (error) {
    console.error("Error translating text with Gemini:", error);
    return "Gagal menerjemahkan sinopsis. Menampilkan teks asli.";
  }
};


export const translateSubtitles = async (vttContent: string): Promise<string> => {
  if (!vttContent) {
    return "";
  }

  try {
    const prompt = `You are a professional subtitle translator. Translate the following WebVTT content from English to Indonesian. 
    IMPORTANT RULES:
    1.  Only translate the dialogue lines.
    2.  DO NOT alter the timestamps (e.g., "00:00:01.000 --> 00:00:03.500").
    3.  DO NOT alter any other VTT formatting cues or metadata.
    4.  DO NOT add "WEBVTT" at the beginning if it's already there.
    5.  DO NOT add any extra commentary, notes, or introductions. Return only the translated VTT content.

    Original VTT Content:
    """
    ${vttContent}
    """`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Clean up potential markdown formatting from the response
    let translatedVtt = response.text.trim();
    if (translatedVtt.startsWith('```vtt')) {
        translatedVtt = translatedVtt.substring(5);
    }
    if (translatedVtt.startsWith('```')) {
        translatedVtt = translatedVtt.substring(3);
    }
    if (translatedVtt.endsWith('```')) {
        translatedVtt = translatedVtt.slice(0, -3);
    }

    return translatedVtt.trim();
  } catch (error) {
    console.error("Error translating subtitles with Gemini:", error);
    // Return original content on failure so user at least gets English subs
    return vttContent; 
  }
};