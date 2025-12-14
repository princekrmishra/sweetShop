"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function PurchasePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [sweet, setSweet] = useState<Sweet | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadSweet(sweetId: string) {
    try {
      const data = await apiFetch(`/sweets/${sweetId}`);
      setSweet(data);
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder() {
    if (!payment || !sweet) return;

    await apiFetch(`/sweets/${sweet.id}/purchase`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });

    alert("Your order is placed");
    router.push("/sweets");
  }

  useEffect(() => {
    if (!id) return;
    loadSweet(id);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!sweet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Sweet not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="border rounded w-full max-w-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-orange-500 text-center">
          Purchase Sweet
        </h1>

        <div className="relative h-40 w-full">
          <Image
            src={getSweetImage(sweet.name)}
            alt={sweet.name}
            fill
            className="object-cover rounded"
          />
        </div>

        <div className="space-y-1">
          <p className="font-semibold">{sweet.name}</p>
          <p className="text-sm text-gray-600">{sweet.category}</p>
          <p>₹{sweet.price}</p>
          <p className="text-sm">Available: {sweet.quantity}</p>
        </div>

        <input
          type="number"
          min={1}
          max={sweet.quantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select payment method</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <button
          onClick={placeOrder}
          className="w-full bg-orange-500 text-white py-2 rounded
                     hover:bg-orange-600 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
