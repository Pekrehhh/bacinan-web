import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMapsUrl(location: any) {
  if (location.maps_url) {
    return location.maps_url;
  }
  
  if (location.coordinate_string) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.coordinate_string)}`;
  }
  
  if (location.kategori === 'Fasilitas Umum' || location.kategori === 'Posyandu') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.nama_lokasi)}`;
  } else if (location.latitude && location.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
  }
  
  return "#";
}
