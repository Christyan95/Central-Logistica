import { create } from "zustand";
import { Filial } from "@/data/filiais";

interface LogisticsState {
  theme: "light" | "dark";
  selectedFilial: Filial | null;
  routeFiliais: Filial[];
  showReport: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setSelectedFilial: (filial: Filial | null) => void;
  setRouteFiliais: (filiais: Filial[]) => void;
  setShowReport: (show: boolean) => void;
  clearRoute: () => void;
}

export const useLogisticsStore = create<LogisticsState>((set) => ({
  theme: "light",
  selectedFilial: null,
  routeFiliais: [],
  showReport: false,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setSelectedFilial: (filial) => set({ selectedFilial: filial }),
  setRouteFiliais: (routeFiliais) => set({ routeFiliais }),
  setShowReport: (showReport) => set({ showReport }),
  clearRoute: () => set({ routeFiliais: [], showReport: false }),
}));
