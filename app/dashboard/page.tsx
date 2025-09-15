import React from "react";
import FlyboothTable from "@/app/components/FlyboothTable";
import prisma from "@/prisma/db";
import { getUserFromCookie } from "@/lib/auth";

export default async function DashboardPage() {
  const { id } = await getUserFromCookie();
  const flybooths = await prisma.flybooth.findMany({
    where: {
      users: {
        some: {
          id,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 p-4 sm:p-6 rounded-lg">
          <FlyboothTable flybooths={flybooths} />
        </div>
      </div>
    </main>
  );
}
