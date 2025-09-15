import React from "react";
import FlyboothAdminPanel from "@/app/components/FlyboothAdminPanel";
import prisma from "@/prisma/db";

type Props = {
  params: Promise<{ flyboothId: string }>;
};

export default async function DashboardFlyboothPage({ params }: Props) {
  const { flyboothId } = await params;
  const flybooth = await prisma.flybooth.findUnique({
    where: { id: flyboothId },
  });

  if (!flybooth) {
    return (
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto text-white">
          <h2 className="text-xl font-semibold">Flybooth introuvable</h2>
        </div>
      </main>
    );
  }

  return (
    <main>
      <FlyboothAdminPanel flybooth={flybooth} />
    </main>
  );
}
