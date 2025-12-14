"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { apiFetch } from "@/lib/api";

type Sweet = {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
};

export default function AdminPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  async function loadSweets() {
    const data = await apiFetch("/sweets");
    setSweets(data);
  }

  async function createSweet() {
    await apiFetch("/sweets", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      }),
    });

    setForm({ name: "", category: "", price: "", quantity: "" });
    loadSweets();
  }

  async function deleteSweet(id: string) {
    await apiFetch(`/sweets/${id}`, { method: "DELETE" });
    loadSweets();
  }

  async function restockSweet(id: string) {
    const qty = prompt("Enter restock quantity");
    if (!qty) return;

    await apiFetch(`/sweets/${id}/restock`, {
      method: "POST",
      body: JSON.stringify({ quantity: Number(qty) }),
    });

    loadSweets();
  }

  useEffect(() => {
    loadSweets();
  }, []);

  return (
    <AdminGuard>
      <div className="p-6 space-y-10">
        <h1 className="text-2xl font-bold text-orange-500 text-center">
          Admin Panel
        </h1>

        <div className="flex justify-center">
          <div className="border rounded p-6 w-full max-w-md space-y-3">
            <h2 className="font-semibold text-lg text-center">
              Add Sweet
            </h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />

            <button
              onClick={createSweet}
              className="w-full bg-orange-500 text-white py-2 rounded
                         hover:bg-orange-600 transition"
            >
              Create Sweet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sweets.map((s) => (
            <div
              key={s.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-600">
                  {s.category}
                </p>
                <p>₹{s.price}</p>
                <p className="text-sm">
                  Stock: {s.quantity}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => restockSweet(s.id)}
                  className="bg-orange-500 text-white px-3 py-1 rounded
                             hover:bg-orange-600 transition"
                >
                  Restock
                </button>

                <button
                  onClick={() => deleteSweet(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded
                             hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
