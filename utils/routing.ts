import { Filial } from "@/data/filiais";

export function getGoogleMapsRouteUrl(filiais: Filial[]) {
  if (filiais.length < 2) return null;
  const origin = `${filiais[0].lat},${filiais[0].lng}`;
  const destination = `${filiais[filiais.length - 1].lat},${filiais[filiais.length - 1].lng}`;
  const waypoints = filiais
    .slice(1, -1)
    .map((f) => `${f.lat},${f.lng}`)
    .join("/");

  return `https://www.google.com/maps/dir/${origin}/${waypoints ? waypoints + "/" : ""}${destination}`;
}

export function formatDuration(seconds: number) {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}
