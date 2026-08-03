import { getVillageInfo, getDemographicStats, getOfficials, getContacts, getLocations } from "@/lib/data";
import DashboardView from "./DashboardView";
import MapTab from "./MapTab";
import OfficialsTab from "./OfficialsTab";

export default async function PublicContentFetcher({ tab }: { tab: string }) {
  // We only fetch the data needed for the active tab!
  
  if (tab === "map") {
    const [villageInfo, locations] = await Promise.all([
      getVillageInfo(),
      getLocations(),
    ]);
    return <MapTab coordinates={villageInfo.gmaps_coordinates} locations={locations || []} />;
  }
  
  if (tab === "officials") {
    const [officials, contacts] = await Promise.all([
      getOfficials(),
      getContacts(),
    ]);
    return (
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-4">
          <OfficialsTab officials={officials} contacts={contacts} />
        </div>
      </div>
    );
  }

  // Default: dashboard
  const [villageInfo, stats] = await Promise.all([
    getVillageInfo(),
    getDemographicStats(),
  ]);
  
  return <DashboardView stats={stats} villageInfo={villageInfo} />;
}
