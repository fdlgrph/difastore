"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) router.push("/admin");
    else setError("Wrong password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <form onSubmit={login} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium">Login</button>
      </form>
    </div>
  );
}
