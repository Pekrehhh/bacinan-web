import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMapsUrl(location: any) {
  if (location.maps_url) {
    return location.maps_url;
  }
  
  const coord = location.coordinate_string?.trim();
  if (coord) {
    if (coord.startsWith('http://') || coord.startsWith('https://')) {
      return coord;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coord)}`;
  }
  
  if (location.kategori === 'Fasilitas Umum' || location.kategori === 'Posyandu') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.nama_lokasi)}`;
  } else if (location.latitude && location.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
  }
  
  return "#";
}
