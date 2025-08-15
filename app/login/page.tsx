"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const handleLogin = () => {
    const callbackUrl = encodeURIComponent(
      `http://localhost:3000/api/auth/callback?redirectUrl=${redirectUrl}`
    );
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/login?id=UrOy6TyGKtoiVnXE3ktOw&callbackUrl=${callbackUrl}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow w-96 flex flex-col items-center">
        <h2 className="text-2xl mb-6 font-bold">Login</h2>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        >
          Login with Auth
        </button>
      </div>
    </div>
  );
}
