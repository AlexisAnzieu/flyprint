import { Flybooth } from "@prisma/client";
import CreateFlyboothButton from "./CreateFlyboothButton";
import Link from "next/link";

export default function FlyboothTable({
  flybooths,
}: {
  flybooths: Flybooth[];
}) {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Vos Flybooth
          </h2>
          <p className="text-white text-sm">
            Gérez vos espaces d&apos;impression et accédez aux options
            administrateur.
          </p>
        </div>
        {flybooths.length > 0 && (
          <div className="flex justify-start">
            <CreateFlyboothButton />
          </div>
        )}
      </div>

      {flybooths.length > 0 ? (
        <div className="grid gap-4 md:gap-6">
          {flybooths.map((fb, index) => (
            <div
              key={fb.id}
              className="group relative glass-effect rounded-xl p-4 sm:p-6 hover:bg-white/[0.08] transition-all duration-300 animate-fade-in border border-white/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              <div className="flex flex-col gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 9H15M9 13H15M9 17H10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-white truncate group-hover:text-purple-200 transition-colors duration-300">
                        {fb.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs text-gray-400 font-mono">
                          ID: {fb.id}
                        </span>
                        <span className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full" />
                        <span className="text-xs text-gray-400">
                          {new Date(fb.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`https://www.flybooth.app/${fb.id}/gallery`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white text-sm font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 hover:scale-105 border border-purple-500/30 shadow-lg group touch-manipulation"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Voir la galerie
                  </Link>

                  <Link
                    href={`/dashboard/${fb.id}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white text-sm font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 hover:scale-105 border border-purple-500/30 shadow-lg group touch-manipulation"
                  >
                    <svg
                      className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.862 5.487a2.06 2.06 0 0 1 2.915 2.915l-9.5 9.5a2 2 0 0 1-.707.464l-3.25 1.083a.5.5 0 0 1-.634-.634l1.083-3.25a2 2 0 0 1 .464-.707l9.5-9.5ZM15.45 7.612l-9.5 9.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Éditer
                  </Link>

                  <Link
                    href={`${process.env.WEBSITE_URL}/${fb.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white text-sm font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 hover:scale-105 border border-blue-500/30 shadow-lg group touch-manipulation"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="13"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Interface d&apos;envoi
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <svg
                className="w-12 h-12 text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Aucun flybooth trouvé
              </h3>
              <p className="text-white text-sm">
                Commencez par créer votre premier flybooth pour gérer vos
                espaces d&apos;impression.
              </p>
            </div>
            <div className="pt-2">
              <CreateFlyboothButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
