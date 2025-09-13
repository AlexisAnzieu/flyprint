import React from "react";
import { getUserFromCookie } from "@/lib/auth";
import prisma from "@/prisma/db";
import StatisticsClient from "./StatisticsClient";
import { Prisma } from "@prisma/client";

export type FlyboothWithPrint = Prisma.FlyboothGetPayload<{
  select: {
    name: true;
    createdAt: true;
    print: {
      select: { createdAt: true };
    };
  };
}>;

export default async function StatisticsPage() {
  const user = await getUserFromCookie();

  const flybooths: FlyboothWithPrint[] = await prisma.flybooth.findMany({
    where: {
      users: { some: { id: user.id } },
    },
    select: {
      name: true,
      createdAt: true,
      print: {
        select: { createdAt: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return <StatisticsClient flybooths={flybooths} />;
}
