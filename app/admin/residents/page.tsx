import { createClient } from "@/utils/supabase/server";
import ResidentsClient from "./ResidentsClient";

export default async function ResidentsPage() {
  const supabase = await createClient();
  const { data: initialResidents } = await supabase.from("residents").select("*").order("created_at", { ascending: false });

  return (
    <ResidentsClient initialResidents={initialResidents || []} />
  );
}
