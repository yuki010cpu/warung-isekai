// src/services/geminiService.ts
// Kode ini pakai REST API Google Gemini — aman untuk React & GitHub

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(prompt: string) {
  if (!API_KEY) {
    return "❌ API key belum diatur di file .env";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respons dari AI";
  } catch (err) {
    console.error("Error Gemini:", err);
    return "❌ Terjadi kesalahan saat memanggil AI.";
  }
}