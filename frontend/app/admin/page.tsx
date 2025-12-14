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
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        {/* CREATE FORM */}
        <div className="border p-4 rounded space-y-2">
          <h2 className="font-semibold">Add Sweet</h2>

          <input
            placeholder="Name"
            className="border p-1 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Category"
            className="border p-1 w-full"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Price"
            className="border p-1 w-full"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Quantity"
            className="border p-1 w-full"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <button
            onClick={createSweet}
            className="bg-black text-white px-4 py-1"
          >
            Create
          </button>
        </div>

        {/* SWEETS LIST */}
        <div className="space-y-3">
          {sweets.map((s) => (
            <div
              key={s.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{s.name}</p>
                <p>{s.category}</p>
                <p>₹{s.price}</p>
                <p>Stock: {s.quantity}</p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => restockSweet(s.id)}
                  className="bg-green-600 text-white px-3 py-1"
                >
                  Restock
                </button>
                <button
                  onClick={() => deleteSweet(s.id)}
                  className="bg-red-600 text-white px-3 py-1"
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
