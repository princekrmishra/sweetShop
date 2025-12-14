"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Sweet = {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
};

export default function SweetsPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [error, setError] = useState("");

  async function loadSweets() {
    try {
      const data = await apiFetch("/sweets");
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
    loadSweets();
  }

  useEffect(() => {
    loadSweets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sweets</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sweets.map((s) => (
          <div key={s.id} className="border p-4 rounded">
            <h2 className="font-semibold">{s.name}</h2>
            <p>{s.category}</p>
            <p>₹{s.price}</p>
            <p>Stock: {s.quantity}</p>

            <button
              disabled={s.quantity === 0}
              onClick={() => purchase(s.id)}
              className="mt-2 w-full bg-green-600 text-white p-1 disabled:opacity-50"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
