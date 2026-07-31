import { createClient } from "@/utils/supabase/server";
import ResidentsClient from "./ResidentsClient";

export default async function ResidentsDataWrapper() {
  const supabase = await createClient();
  const { data: initialResidents, error } = await supabase
    .from("residents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching residents for table:", error);
  }

  return <ResidentsClient initialResidents={initialResidents || []} />;
}
