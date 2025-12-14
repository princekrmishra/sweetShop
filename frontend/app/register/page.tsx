"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP HEADER */}
      <header className="p-4">
        <span className="text-xl font-bold text-orange-500">
          Sweet Shop
        </span>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1">
        {/* LEFT IMAGE */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-orange-50">
          <Image
            src="/sweet.jpg"
            alt="Sweet Shop"
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </div>

        {/* RIGHT FORM */}
        <div className="flex w-full md:w-1/2 items-center justify-center">
          <form
            onSubmit={handleRegister}
            className="w-96 p-6 border rounded space-y-4"
          >
            <h1 className="text-2xl font-bold text-center">
              Register
            </h1>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <input
              className="w-full border p-2 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full border p-2 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded
                         hover:bg-orange-600 transition"
            >
              Register
            </button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-orange-500 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
