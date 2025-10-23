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
