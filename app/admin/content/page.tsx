import { getVillageInfo, getOfficials, getContacts } from "@/lib/data";
import ContentClient from "./ContentClient";

export default async function ContentPage() {
  const villageInfo = await getVillageInfo();
  const officials = await getOfficials();
  const contacts = await getContacts();

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
      />
    </div>
  );
}
