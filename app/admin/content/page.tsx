import { getVillageInfo, getOfficials, getContacts, getLocations } from "@/lib/data";
import ContentClient from "./ContentClient";

export default async function ContentPage() {
  const villageInfo = await getVillageInfo();
  const officials = await getOfficials();
  const contacts = await getContacts();
  const locations = await getLocations();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Kelola Konten</h1>
        <p className="text-slate-500 mt-2">
          Perbarui informasi publik, profil dusun, dan kontak penting.
        </p>
      </div>

      <ContentClient 
        initialVillageInfo={villageInfo} 
        initialOfficials={officials} 
        initialContacts={contacts}
        initialLocations={locations}
      />
    </div>
  );
}
