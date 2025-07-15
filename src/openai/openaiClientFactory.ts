import OpenAI from "openai";

/**
 * Crea una instancia del cliente OpenAI o compatible, usando variables de entorno:
 * - OPENAI_API_KEY: clave de API
 * - OPENAI_BASE_URL: endpoint alternativo (opcional)
 */
export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY no está definida en el entorno");

  const baseURL = process.env.OPENAI_BASE_URL;

  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {})
  });
} 