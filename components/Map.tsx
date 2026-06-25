/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, memo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
  GeoJSON,
  useMapEvents,
  ZoomControl,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Filial } from "@/data/filiais";
import { MapPin, Navigation } from "lucide-react";

// Fix icons...
if (typeof window !== "undefined") {
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;
}

// Custom icons...
const branchIcon = (isSelected: boolean) =>
  L.divIcon({
    className: "custom-icon",
    html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      cursor: pointer;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: ${isSelected ? "scale(1.1) translateY(-4px)" : "scale(1)"};
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${isSelected ? "var(--primary)" : "var(--accent)"}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="none"/>
      </svg>
    </div>
  `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

// Map Events sub-component
function MapEvents({
  onZoomChange,
  onInteraction,
}: {
  onZoomChange: (zoom: number) => void;
  onInteraction: () => void;
}) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    },
    dragstart() {
      onInteraction();
    },
    zoomstart() {
      onInteraction();
    },
    mousedown() {
      onInteraction();
    },
  });
  return null;
}

// Change View sub-component
function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

interface MapProps {
  filiais: Filial[];
  selectedFilial: Filial | null;
  routeFiliais: Filial[];
  routeGeometry: Record<string, unknown> | null;
  theme: "light" | "dark";
  onSelect: (filial: Filial) => void;
}

export default memo(function Map({
  filiais,
  selectedFilial,
  routeFiliais,
  routeGeometry,
  theme,
  onSelect,
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [zoom, setZoom] = useState(7);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsManual(false);
  }, [selectedFilial]);

  if (!isMounted)
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "var(--background)",
        }}
      />
    );

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    theme === "dark"
      ? '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer
        center={[-19.5, -47.0]}
        zoom={7}
        minZoom={4}
        maxZoom={19}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        worldCopyJump={false}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <ZoomControl position="bottomright" />
        <MapEvents
          onZoomChange={setZoom}
          onInteraction={() => setIsManual(true)}
        />

        {selectedFilial && !isManual && (
          <ChangeView
            key={`goto-${selectedFilial.id}`}
            center={[selectedFilial.lat, selectedFilial.lng]}
            zoom={14}
          />
        )}

        {!selectedFilial && !isManual && (
          <ChangeView key="general-view" center={[-19.5, -47.0]} zoom={7} />
        )}

        <TileLayer
          key={theme}
          attribution={attribution}
          url={tileUrl}
          noWrap={true} // Prevents duplication of the world map
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
        />

        {filiais.map((filial) => {
          const isSelected = selectedFilial?.id === filial.id;
          const isUberabaArea =
            filial.city.includes("Uberaba") || filial.name.includes("CSC");
          const labelOffset: [number, number] = isUberabaArea
            ? filial.id === "1"
              ? [-10, -46]
              : [10, -36]
            : [0, -36];

          return (
            <Marker
              key={filial.id}
              position={[filial.lat, filial.lng]}
              icon={branchIcon(isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => {
                  setIsManual(false);
                  onSelect(filial);
                },
              }}
            >
              {zoom < 12 && (
                <Tooltip
                  permanent
                  direction="top"
                  offset={labelOffset}
                  className="custom-label-tooltip"
                >
                  <div
                    style={{
                      color: "var(--foreground)",
                      fontWeight: 800,
                      fontSize: zoom < 8 ? "14px" : "11px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      textShadow: "0 0 4px var(--background)",
                      pointerEvents: "none",
                      opacity: 0.9,
                    }}
                  >
                    {filial.name}
                  </div>
                </Tooltip>
              )}

              <Popup minWidth={220}>
                <div style={{ padding: "4px" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "var(--primary)",
                      marginBottom: "8px",
                    }}
                  >
                    {filial.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "13px",
                      opacity: 0.9,
                      marginBottom: "16px",
                      color: "var(--foreground)",
                      lineHeight: "1.4",
                    }}
                  >
                    <MapPin
                      size={16}
                      style={{
                        marginTop: "2px",
                        flexShrink: 0,
                        color: "var(--primary)",
                      }}
                    />
                    {filial.address}
                  </div>
                  {filial.link && (
                    <a
                      href={filial.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glow"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "12px",
                        background: "var(--primary)",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: 700,
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Navigation size={16} />
                      ABRIR NO GOOGLE MAPS
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {routeGeometry && (
          <GeoJSON
            data={routeGeometry as any}
            style={{ color: "var(--primary)", weight: 5, opacity: 0.7 }}
          />
        )}
        {!routeGeometry && routeFiliais.length > 1 && (
          <Polyline
            positions={routeFiliais.map((f) => [f.lat, f.lng])}
            color="var(--primary)"
            weight={4}
            opacity={0.5}
            dashArray="10, 10"
          />
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .leaflet-tooltip.custom-label-tooltip {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .leaflet-tooltip-top.custom-label-tooltip:before {
            display: none !important;
          }
           .leaflet-popup-content-wrapper {
            border-radius: 16px !important;
          }
        `,
          }}
        />
      </MapContainer>
    </div>
  );
});
