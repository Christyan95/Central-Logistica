import { NextResponse } from "next/server";
import { z } from "zod";
import { filiais, Filial } from "@/data/filiais";

// Zod Schema for validation
const routeRequestSchema = z.object({
  filialIds: z
    .array(z.string())
    .min(2, "São necessárias no mínimo duas filiais para calcular uma rota."),
});

// Haversine distance in meters (Kept for future reference)
/* function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
} */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validation with Zod
    const result = routeRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const { filialIds } = result.data;

    // 2. Map IDs to Filial objects EXACTLY in the order they were provided
    const selectedFiliais = filialIds
      .map((id) => filiais.find((f) => f.id === id))
      .filter(Boolean) as Filial[];

    if (selectedFiliais.length !== filialIds.length) {
      return NextResponse.json(
        { error: "Uma ou mais filiais não foram encontradas." },
        { status: 404 },
      );
    }

    // 3. Use strictly user-selected order instead of TSP optimization
    const finalRoute = selectedFiliais;

    // 4. Fetch Routing Geometry from OSRM securely from the backend
    const coords = finalRoute.map((f) => `${f.lng},${f.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false&annotations=distance`;

    const osrmResponse = await fetch(url, {
      headers: {
        "User-Agent": "CentralLogistica-EnterpriseBackend/1.0",
      },
    });

    if (!osrmResponse.ok) {
      throw new Error(`OSRM API responded with status ${osrmResponse.status}`);
    }

    const data = await osrmResponse.json();
    if (data.code !== "Ok") {
      throw new Error(`OSRM routing failed: ${data.code}`);
    }

    const route = data.routes[0];
    const routeStats = {
      geometry: route.geometry,
      distance: route.distance,
      duration: route.duration,
      legs: route.legs,
    };

    // Return the combined payload
    return NextResponse.json({
      optimizedFiliais: finalRoute,
      routeStats,
    });
  } catch (error: unknown) {
    console.error("Routing API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Falha interna ao calcular rota.", details: errorMessage },
      { status: 500 },
    );
  }
}
