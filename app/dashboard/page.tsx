import React from "react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Link
          href="/api/auth/logout"
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition inline-block"
        >
          Logout
        </Link>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">
            Welcome to your dashboard! Here you can view stats, manage your
            account, and more.
          </p>
        </div>
      </div>
    </main>
  );
}
