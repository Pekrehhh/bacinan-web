import { getVillageInfo, getDemographicStats, getOfficials, getContacts, getLocations } from "@/lib/data";
import PublicLayout from "@/components/public/PublicLayout";

export const revalidate = 60; // Revalidate cache every minute

export default async function Home() {
  // Fetch data in parallel
  const [villageInfo, stats, officials, contacts, locations] = await Promise.all([
    getVillageInfo(),
    getDemographicStats(),
    getOfficials(),
    getContacts(),
    getLocations(),
  ]);

  return (
    <PublicLayout 
      villageInfo={villageInfo} 
      stats={stats} 
      officials={officials} 
      contacts={contacts} 
      locations={locations}
    />
  );
}
