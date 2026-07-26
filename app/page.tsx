import { getVillageInfo, getDemographicStats, getOfficials, getContacts } from "@/lib/data";
import PublicLayout from "@/components/public/PublicLayout";

export const revalidate = 60; // Revalidate cache every minute

export default async function Home() {
  // Fetch data in parallel
  const [villageInfo, stats, officials, contacts] = await Promise.all([
    getVillageInfo(),
    getDemographicStats(),
    getOfficials(),
    getContacts(),
  ]);

  return (
    <PublicLayout 
      villageInfo={villageInfo} 
      stats={stats} 
      officials={officials} 
      contacts={contacts} 
    />
  );
}
