
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
  console.warn("Gemini API key not found. Translation feature will be disabled.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

export const translateText = async (text: string): Promise<string> => {
  if (!ai) {
    return "Layanan terjemahan tidak tersedia. (Kunci API Gemini tidak ditemukan)";
  }
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
