import { Flybooth } from "@prisma/client";
import CreateFlyboothButton from "./CreateFlyboothButton";
import Link from "next/link";

export default function FlyboothTable({
  flybooths,
}: {
  flybooths: Flybooth[];
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Vos Flybooths{" "}
            <span className="text-sm text-slate-400 ml-2">
              ({flybooths.length})
            </span>
          </h2>
          <p className="text-sm text-white  mt-1">
            Gérez vos espaces d&apos;impression et accédez aux options
            administrateur.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateFlyboothButton />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-transparent">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Public
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Créé
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent">
            {flybooths.map((fb) => (
              <tr
                key={fb.id}
                className="group transition duration-150 ease-in-out hover:bg-white/2"
              >
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-medium text-white">
                    {fb.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">ID: {fb.id}</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <Link
                    href={`/${fb.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-slate-700/20 text-blue-200"
                  >
                    Voir
                  </Link>
                </td>
                <td className="px-6 py-4 align-middle">
                  <Link
                    href={`/dashboard/${fb.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-700/10 text-white text-sm hover:scale-105 transition-transform"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M9 11l3-3 3 3M9 17l3-3 3 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Gérer
                  </Link>
                </td>
                <td className="px-6 py-4 align-middle text-sm text-slate-400">
                  {new Date(fb.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {flybooths.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  Aucun flybooth trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
