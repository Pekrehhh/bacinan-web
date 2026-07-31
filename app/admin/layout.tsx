import AdminLayoutClient from "./AdminLayoutClient";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}
