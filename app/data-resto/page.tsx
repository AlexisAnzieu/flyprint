"use client";

import { useState } from "react";

interface SaladOrder {
  name: string;
  base: string;
  toppings: string[];
  protein: string;
  dressing: string;
}

export default function DataResto() {
  const [order, setOrder] = useState<SaladOrder>({
    name: "",
    base: "",
    toppings: [],
    protein: "",
    dressing: "",
  });

  const bases = ["Laitue Romaine", "Épinards", "Mesclun", "Roquette"];
  const toppingOptions = [
    "Tomates cerises",
    "Concombre",
    "Carottes râpées",
    "Oignons rouges",
    "Avocat",
    "Maïs",
    "Olives",
    "Poivrons",
  ];
  const proteins = ["Poulet grillé", "Saumon", "Tofu", "Oeufs durs", "Thon"];
  const dressings = [
    "Vinaigrette Balsamique",
    "Ranch",
    "César",
    "Huile olive citron",
  ];

  const handleToppingChange = (topping: string) => {
    setOrder((prev) => ({
      ...prev,
      toppings: prev.toppings.includes(topping)
        ? prev.toppings.filter((t) => t !== topping)
        : [...prev.toppings, topping],
    }));
  };

  const handlePrint = async () => {
    try {
      const response = await fetch("/api/print-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Erreur impression");
      }

      alert("Commande envoyée à l'impression!");
    } catch (error) {
      alert("Erreur lors de l'impression");
      console.error(error);
    }
  };

  const isOrderComplete = () => {
    return (
      order.name &&
      order.base &&
      order.protein &&
      order.dressing &&
      order.toppings.length > 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-4 px-2 font-mono text-green-500">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          INSERT INTO salad_orders
        </h1>

        {/* Name Input */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            SELECT customer_name FROM users
          </h2>
          <input
            type="text"
            value={order.name}
            onChange={(e) =>
              setOrder((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Votre nom"
            className="w-full p-3 rounded bg-gray-700 text-green-500 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </section>

        {/* Base Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            SELECT base FROM ingredients WHERE type = &apos;base&apos;
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {bases.map((base) => (
              <button
                key={base}
                onClick={() => setOrder((prev) => ({ ...prev, base }))}
                className={`p-3 rounded border ${
                  order.base === base
                    ? "bg-green-500 text-gray-900 border-green-600"
                    : "bg-gray-700 border-green-500 hover:bg-gray-600"
                }`}
              >
                {base}
              </button>
            ))}
          </div>
        </section>

        {/* Toppings Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            SELECT toppings FROM ingredients WHERE type = &apos;topping&apos;
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {toppingOptions.map((topping) => (
              <button
                key={topping}
                onClick={() => handleToppingChange(topping)}
                className={`p-3 rounded border ${
                  order.toppings.includes(topping)
                    ? "bg-green-500 text-gray-900 border-green-600"
                    : "bg-gray-700 border-green-500 hover:bg-gray-600"
                }`}
              >
                {topping}
              </button>
            ))}
          </div>
        </section>

        {/* Protein Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            SELECT protein FROM ingredients WHERE type = &apos;protein&apos;
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {proteins.map((protein) => (
              <button
                key={protein}
                onClick={() => setOrder((prev) => ({ ...prev, protein }))}
                className={`p-3 rounded border ${
                  order.protein === protein
                    ? "bg-green-500 text-gray-900 border-green-600"
                    : "bg-gray-700 border-green-500 hover:bg-gray-600"
                }`}
              >
                {protein}
              </button>
            ))}
          </div>
        </section>

        {/* Dressing Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            SELECT dressing FROM ingredients WHERE type = &apos;dressing&apos;
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {dressings.map((dressing) => (
              <button
                key={dressing}
                onClick={() => setOrder((prev) => ({ ...prev, dressing }))}
                className={`p-3 rounded border ${
                  order.dressing === dressing
                    ? "bg-green-500 text-gray-900 border-green-600"
                    : "bg-gray-700 border-green-500 hover:bg-gray-600"
                }`}
              >
                {dressing}
              </button>
            ))}
          </div>
        </section>

        {/* Order Summary and Print Button */}
        <section className="mt-6">
          <button
            onClick={handlePrint}
            disabled={!isOrderComplete()}
            className={`w-full py-4 rounded border text-lg font-semibold ${
              isOrderComplete()
                ? "bg-green-500 text-gray-900 border-green-600 hover:bg-green-600"
                : "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            COMMIT TRANSACTION;
          </button>
        </section>
      </div>
    </div>
  );
}
