import { Suspense } from "react";
import Header from "@/components/public/Header";
import PublicContentFetcher from "@/components/public/PublicContentFetcher";

export const revalidate = 60; // Revalidate cache every minute

export default function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Suspense fallback={<div className="h-20 bg-slate-50 border-b border-slate-200"></div>}>
        <Header />
      </Suspense>
      
      <main className="flex-1 py-8">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-slate-500 font-medium animate-pulse">Memuat data desa...</p>
          </div>
        }>
          <AsyncContent searchParamsPromise={props.searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function AsyncContent({ searchParamsPromise }: { searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await searchParamsPromise;
  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : 'dashboard';
  return <PublicContentFetcher tab={tab} />;
}
