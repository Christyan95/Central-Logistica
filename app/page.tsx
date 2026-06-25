"use client";

import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import { useLogisticsStore } from "@/store/useLogisticsStore";
import { filiais, Filial } from "@/data/filiais";

import Sidebar from "@/components/Sidebar";
import { getGoogleMapsRouteUrl, formatDuration } from "@/utils/routing";
import { FileText, X, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Load Map dynamically to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="loader"></div>
      <style>{`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .loader { 
        width: 60px; 
        height: 60px; 
        border: 4px solid rgba(7, 80, 0, 0.1); 
        border-top: 4px solid var(--primary); 
        border-radius: 50%; 
        animation: spin 1s linear infinite;
        box-shadow: 0 0 30px rgba(7, 80, 0, 0.2);
       }
    `}</style>
    </div>
  ),
});

export default function Home() {
  const {
    theme,

    selectedFilial,
    setSelectedFilial,
    routeFiliais,
    setRouteFiliais,
    showReport,
    setShowReport,
    clearRoute,
  } = useLogisticsStore();



  const {
    data: routeData,
    mutate: optimizeRoute,
    isPending: loading,
    reset: resetRouteData,
  } = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch("/api/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filialIds: ids }),
      });
      if (!response.ok) throw new Error("Falha ao calcular rota");
      return response.json();
    },
    onSuccess: (data) => {
      setRouteFiliais(data.optimizedFiliais);
      if (data.optimizedFiliais.length > 0) {
        setSelectedFilial(data.optimizedFiliais[0]);
      }
    },
  });

  const routeStats = routeData?.routeStats || null;

  // Sync theme with body data-attribute for CSS selectors
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleSelect = useCallback(
    (filial: Filial) => {
      if (selectedFilial?.id === filial.id) {
        setSelectedFilial(null);
      } else {
        setSelectedFilial(filial);
      }
    },
    [selectedFilial, setSelectedFilial],
  );

  const handleOptimizeRoute = useCallback(
    (ids: string[]) => {
      if (ids.length < 2) return;
      optimizeRoute(ids);
    },
    [optimizeRoute],
  );

  const handleClearRoute = useCallback(() => {
    clearRoute();
    resetRouteData();
  }, [clearRoute, resetRouteData]);

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--background)",
        userSelect: "none",
      }}
    >
      {/* Sidebar Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <Sidebar
            filiais={filiais}
            onSelect={handleSelect}
            selectedId={selectedFilial?.id || null}
            onOptimizeRoute={handleOptimizeRoute}
            onClearRoute={handleClearRoute}
            isRouteActive={routeFiliais.length > 0}
          />
        </div>
      </div>

      {/* Floating Buttons Group */}
      <div
        style={{
          position: "absolute",
          top: "min(30px, 5vh)",
          right: "min(30px, 5vw)",
          zIndex: 2000,
          display: "flex",
          gap: "12px",
        }}
      >
        {/* Report Button */}
        {routeStats && (
          <button
            onClick={() => setShowReport(!showReport)}
            className="glass glow"
            aria-label="Route Report"
            style={{
              padding: "0 24px",
              height: "50px",
              borderRadius: "15px",
              border: "1px solid var(--border)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "var(--foreground)",
              transition: "all 0.3s ease",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <FileText size={20} color="var(--primary)" />
            Relatório de Rota
          </button>
        )}
      </div>

      {/* Route Report Modal */}
      <AnimatePresence>
        {showReport && routeStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: "absolute",
              top: "min(100px, 15vh)",
              right: "min(30px, 5vw)",
              width: "min(calc(100vw - 60px), 400px)",
              maxHeight: "80vh",
              overflowY: "auto",
              zIndex: 2001,
              borderRadius: "24px",
              padding: "24px",
            }}
            className="glass glow"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: 800 }}>
                Resumo da Logística
              </h2>
              <button
                onClick={() => setShowReport(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--foreground)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxHeight: "60vh",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {routeStats.legs.map(
                (leg: { distance: number; duration: number }, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      padding: "12px",
                      background: "var(--surface)",
                      borderRadius: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        opacity: 0.6,
                      }}
                    >
                      <span>Trecho {idx + 1}</span>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <span
                          style={{ color: "var(--primary)", fontWeight: 700 }}
                        >
                          {(leg.distance / 1000).toFixed(1)} km
                        </span>
                        <span
                          style={{
                            color: "var(--primary)",
                            opacity: 0.8,
                            fontWeight: 500,
                          }}
                        >
                          {formatDuration(leg.duration)}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--accent)",
                          }}
                        />
                        <div
                          style={{
                            width: "1px",
                            height: "10px",
                            background: "var(--border)",
                          }}
                        />
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--primary)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span>{routeFiliais[idx]?.name}</span>
                        <span style={{ opacity: 0.8 }}>
                          {routeFiliais[idx + 1]?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "var(--primary)",
                    color: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      opacity: 0.8,
                    }}
                  >
                    Distância Total
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 800 }}>
                    {(routeStats.distance / 1000).toFixed(1)} km
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      opacity: 0.8,
                    }}
                  >
                    Tempo Estimado
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 800 }}>
                    {formatDuration(routeStats.duration)}
                  </div>
                </div>
              </div>

              <a
                href={getGoogleMapsRouteUrl(routeFiliais) || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="glow"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "14px",
                  background: "var(--secondary)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "14px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
              >
                <Navigation size={20} />
                INICIAR PERCURSO NO GOOGLE MAPS
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            padding: "12px 24px",
            borderRadius: "12px",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "var(--primary)",
            fontSize: "14px",
            fontWeight: 600,
          }}
          className="glass"
        >
          <div className="mini-spinner"></div>
          Otimizando Logística...
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .mini-spinner {
              width: 16px; height: 16px; border: 2px solid rgba(7, 80, 0, 0.2);
              border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite;
            }
          `}</style>
        </div>
      )}

      {/* Map Content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Map
          filiais={filiais}
          selectedFilial={selectedFilial}
          onSelect={handleSelect}
          routeFiliais={routeFiliais}
          routeGeometry={routeStats?.geometry || null}
          theme={theme}
        />
      </div>

      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          border: "0",
        }}
      >
        Logistics Hub - Gestão & Geolocalização
      </h1>
    </main>
  );
}
