import React from "react";
import FlyboothTable from "@/app/components/FlyboothTable";
import prisma from "@/prisma/db";

export default async function DashboardPage() {
  const flybooths = await prisma.flybooth.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>

        <div className="bg-white/5 p-6 rounded-lg">
          <FlyboothTable flybooths={flybooths} />
        </div>
      </div>
    </main>
  );
}
