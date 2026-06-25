"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { Filial } from "@/data/filiais";
import WeatherWidget from "./WeatherWidget";
import {
  MapPin,
  Navigation,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SidebarProps {
  filiais: Filial[];
  onSelect: (filial: Filial) => void;
  selectedId: string | null;
  onOptimizeRoute: (selectedIds: string[]) => void;
  onClearRoute: () => void;
  isRouteActive: boolean;
}

export default memo(function Sidebar({
  filiais,
  onSelect,
  selectedId,
  onOptimizeRoute,
  onClearRoute,
  isRouteActive,
}: SidebarProps) {
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");




  const toggleToRoute = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRouteIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };


  const handleClear = () => {
    setRouteIds([]);
    onClearRoute();
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed
          ? "60px"
          : isMobile
            ? "min(320px, calc(100vw - 40px))" // Reduzida no mobile
            : "min(calc(100vw - 40px), 400px)",
        height: isCollapsed ? "60px" : "calc(100vh - 40px)",
      }}
      className="glass"
      style={{
        margin: "20px",
        borderRadius: isCollapsed ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        position: "relative",
        overflow: "hidden",
        transition: "border-radius 0.3s ease",
      }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          zIndex: 1001,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--foreground)",
        }}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            {/* Header / Brand Logo */}
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src="/hortsoy-logo.png"
                alt="HortSoy Logo"
                width={200}
                height={80}
                style={{
                  maxHeight: "80px",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Stats Quick View */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                padding: "24px 24px 16px",
              }}
            >
              <div
                className="glass"
                style={{
                  padding: "12px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: 0.6,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  <MapPin size={12} color="var(--primary)" /> Unidades
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginTop: "4px",
                  }}
                >
                  {filiais.length}
                </div>
              </div>
              <div
                className="glass"
                style={{
                  padding: "12px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: 0.6,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  <TrendingUp size={12} color="var(--accent)" /> Na Rota
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginTop: "4px",
                  }}
                >
                  {routeIds.length}
                </div>
              </div>
            </div>

            {/* List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0 12px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <AnimatePresence>
                {filiais.map((filial) => (
                  <motion.div
                    layout
                    key={filial.id}
                    onClick={() => onSelect(filial)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      background:
                        selectedId === filial.id
                          ? "var(--surface-hover)"
                          : "transparent",
                      border:
                        selectedId === filial.id
                          ? "1px solid var(--primary)"
                          : "1px solid transparent",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {/* Checkbox for Route Selection */}
                      <button
                        onClick={(e) => toggleToRoute(e, filial.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: "16px",
                          margin: "-8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: routeIds.includes(filial.id)
                            ? "var(--primary)"
                            : "var(--accent)",
                          transition: "all 0.2s ease",
                          transform: routeIds.includes(filial.id)
                            ? "scale(1.1)"
                            : "scale(1)",
                          zIndex: 10,
                          position: "relative",
                        }}
                      >
                        {routeIds.includes(filial.id) ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <Circle size={24} />
                        )}
                      </button>

                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {filial.name}
                        </h3>
                        <WeatherWidget lat={filial.lat} lng={filial.lng} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer / Route Controls */}
            <div
              style={{
                padding: "24px",
                background: "rgba(0,0,0,0.05)",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                onClick={() => {
                  onOptimizeRoute(routeIds);
                  setIsCollapsed(true);
                }}
                disabled={routeIds.length < 2}
                className="glow"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "14px",
                  background:
                    routeIds.length < 2 ? "var(--surface)" : "var(--primary)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "15px",
                  border: "none",
                  cursor: routeIds.length < 2 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  opacity: routeIds.length < 2 ? 0.5 : 1,
                }}
              >
                <Navigation size={18} />
                CALCULAR ROTA OTIMIZADA
              </button>

              <button
                onClick={handleClear}
                disabled={routeIds.length === 0 && !isRouteActive}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "transparent",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  fontSize: "13px",
                  border: "1px solid var(--border)",
                  cursor:
                    routeIds.length === 0 && !isRouteActive
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.3s ease",
                  opacity: routeIds.length === 0 && !isRouteActive ? 0.3 : 1,
                }}
              >
                <RotateCcw size={16} />
                LIMPAR ROTA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
