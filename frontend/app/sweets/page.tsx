"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

type Sweet = {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
};

function getSweetImage(name: string) {
  const n = name.toLowerCase();
  if (n.includes("jalebi")) return "/jalebi.jpg";
  if (n.includes("choco")) return "/choco.jpg";
  if (n.includes("rabri")) return "/rabri-recipe.jpg";
  return "/sweet.jpg";
}

export default function SweetsPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadSweets(query = "") {
    try {
      const data = await apiFetch(
        query ? `/sweets/search?name=${query}` : "/sweets"
      );
      setSweets(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function purchase(id: string) {
    await apiFetch(`/sweets/${id}/purchase`, {
      method: "POST",
      body: JSON.stringify({ quantity: 1 }),
    });
    loadSweets(search);
  }

  useEffect(() => {
    loadSweets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-500">
        Sweets
      </h1>

      <div className="mb-6 flex gap-3 max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sweets"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={() => loadSweets(search)}
          className="bg-orange-500 text-white px-4 rounded hover:bg-orange-600 transition"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sweets.map((s) => (
          <div
            key={s.id}
            className="border rounded shadow-sm overflow-hidden"
          >
            <div className="relative h-40 w-full">
              <Image
                src={getSweetImage(s.name)}
                alt={s.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 space-y-1">
              <h2 className="font-semibold text-lg">{s.name}</h2>
              <p className="text-sm text-gray-600">{s.category}</p>
              <p className="font-medium">₹{s.price}</p>
              <p className="text-sm">Stock: {s.quantity}</p>

              <button
                disabled={s.quantity === 0}
                onClick={() => purchase(s.id)}
                className="mt-3 w-full bg-orange-500 text-white py-2 rounded
                           hover:bg-orange-600 transition
                           disabled:opacity-50"
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
