import React from "react";
import LeftNav from "@/app/components/LeftNav";

export const metadata = {
  title: "Dashboard - Flyprint",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
      <LeftNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
