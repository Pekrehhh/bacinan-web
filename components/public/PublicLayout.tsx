"use client";

import { useState } from "react";
import Header from "./Header";
import DashboardView from "./DashboardView";
import MapTab from "./MapTab";
import OfficialsTab from "./OfficialsTab";

export default function PublicLayout({ 
  villageInfo, 
  stats, 
  officials, 
  contacts 
}: { 
  villageInfo: any; 
  stats: any[]; 
  officials: any[]; 
  contacts: any[]; 
}) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 py-8">
        {activeTab === "dashboard" && <DashboardView stats={stats} villageInfo={villageInfo} />}
        {activeTab === "map" && <MapTab coordinates={villageInfo.gmaps_coordinates} />}
        {activeTab === "officials" && (
          <div className="max-w-7xl mx-auto px-4">
            <OfficialsTab officials={officials} contacts={contacts} />
          </div>
        )}
      </main>
    </div>
  );
}
