"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 min-h-screen flex flex-col items-center safe-area-pt relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse-slow"></div>

      <div className="relative z-10 flex flex-col items-center text-white w-full max-w-2xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Flyprint</h1>
          <p className="text-gray-300 text-xl mb-6">
            Solution professionnelle de photobooth connecté pour événements,
            entreprises et lieux publics.
            <br />
            Impression instantanée, personnalisation avancée, gestion
            centralisée.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">
              Commencer
            </Link>
          </div>
        </header>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
          <div className="glass-effect rounded-2xl p-6 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">✓</span>
            <h3 className="font-semibold mb-2">Impression instantanée</h3>
            <p className="text-gray-300 text-sm">
              Impression rapide et fiable pour chaque photo prise, idéale pour
              les événements professionnels.
            </p>
          </div>
          <div className="glass-effect rounded-2xl p-6 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">✓</span>
            <h3 className="font-semibold mb-2">Personnalisation avancée</h3>
            <p className="text-gray-300 text-sm">
              Ajoutez des légendes, logos et designs personnalisés pour
              renforcer votre image de marque.
            </p>
          </div>
          <div className="glass-effect rounded-2xl p-6 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">✓</span>
            <h3 className="font-semibold mb-2">Gestion centralisée</h3>
            <p className="text-gray-300 text-sm">
              Suivi des impressions, statistiques et administration sécurisée
              via le dashboard.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="glass-effect rounded-2xl p-8 mb-12 w-full animate-slide-up">
          <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
            Fonctionnement
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">📷</span>
              <span className="font-semibold">1. Capturez la photo</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🎨</span>
              <span className="font-semibold">
                2. Personnalisez avec légende et logo
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🖨️</span>
              <span className="font-semibold">3. Impression immédiate</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center text-gray-400 py-6 text-sm">
          <div className="mb-2">
            <Link href="/dashboard" className="underline hover:text-white">
              Dashboard
            </Link>
            {" | "}
            <Link
              href="https://github.com/AlexisAnzieu/flyprint"
              className="underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code source
            </Link>
          </div>
          <div>
            © {new Date().getFullYear()} Flyprint — Photobooth professionnel.
          </div>
        </footer>
      </div>
    </main>
  );
}
