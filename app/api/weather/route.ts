import { NextResponse } from "next/server";
import { z } from "zod";

const weatherRequestSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar payload
    const result = weatherRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Coordenadas inválidas.", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const { lat, lng } = result.data;

    // Open-Meteo não exige API Key. Limitado a 10.000 requisições por dia gratuitamente.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation_probability&timezone=America%2FSao_Paulo`;

    // Chamada com cache no servidor (Next.js fetch cache) por 15 minutos (900 segundos)
    const response = await fetch(url, {
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo API Error: ${response.status}`);
    }

    const data = await response.json();

    // Fallback seguro caso a API não retorne dados de precipitação (ocorre em certas áreas geográficas rurais)
    const current = data.current || {};
    const temperature = current.temperature_2m ?? null;
    const pop = current.precipitation_probability ?? 0;

    return NextResponse.json({
      temperature,
      precipitationProbability: pop,
    });
  } catch (error: unknown) {
    console.error("Weather API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Falha interna ao buscar clima.", details: errorMessage },
      { status: 500 },
    );
  }
}
