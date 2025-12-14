"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, [pathname]); // re-check on route change

  function logout() {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    router.push("/login");
  }

  // Hide navbar completely on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="p-4 border-b flex items-center gap-6">
      {/* Brand */}
      <span className="text-xl font-bold text-orange-500">
        Sweet Shop
      </span>

      {/* Common links */}
      <Link href="/sweets" className="hover:underline">
        Sweets
      </Link>

      {/* Admin-only link */}
      {role === "ADMIN" && (
        <Link href="/admin" className="hover:underline">
          Admin
        </Link>
      )}

      {/* Logout */}
      {isLoggedIn && (
        <button
          onClick={logout}
          className="ml-auto bg-red-500 text-white w-[5%] rounded-2xl"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
