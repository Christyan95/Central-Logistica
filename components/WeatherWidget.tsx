"use client";

import { useQuery } from "@tanstack/react-query";
import { CloudRain, Thermometer, CloudFog, Loader2 } from "lucide-react";

interface WeatherWidgetProps {
  lat: number;
  lng: number;
}

export default function WeatherWidget({ lat, lng }: WeatherWidgetProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: async () => {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      if (!res.ok) throw new Error("Falha ao buscar clima");
      return res.json();
    },
    staleTime: 1000 * 60 * 15, // Cache client-side por 15 min
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          opacity: 0.5,
          fontSize: "11px",
        }}
      >
        <Loader2 size={12} className="spin" />
        Sincronizando...
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .spin { animation: spin 2s linear infinite; }
        `}</style>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--accent)",
          fontSize: "11px",
          opacity: 0.8,
        }}
      >
        <CloudFog size={12} />
        <span title="Falha ao sincronizar">Indisponível</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {data.temperature !== null && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "var(--foreground)",
            opacity: 0.9,
          }}
        >
          <Thermometer size={14} color="var(--primary)" />
          {data.temperature}°C
        </div>
      )}
      {data.precipitationProbability !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "var(--foreground)",
            opacity: 0.9,
          }}
        >
          <CloudRain size={14} color="#0ea5e9" />
          {data.precipitationProbability}% chuva
        </div>
      )}
    </div>
  );
}
