"use client";

import { useState, useCallback } from "react";

interface SaladOrder {
  name: string;
  base: string;
  toppings: string[];
  proteins: string[];
  dressing: string;
}

export default function DataResto() {
  const [order, setOrder] = useState<SaladOrder>({
    name: "",
    base: "",
    toppings: [],
    proteins: [],
    dressing: "",
  });

  const bases = ["Riz sushis", "Riz sushis avec feuille d'algue", "Aucune "];
  const toppingOptions = [
    "Avocat",
    "Carotte râpée",
    "Champignons",
    "Concombre râpé",
    "Coriandre",
    "Edamame",
    "Germes de Luzerne",
    "Gingembre",
    "Graines de sésame",
    "Graines de tournesol",
    "Oignons à l'hibiscus",
    "Oignons verts",
    "Poivrons",
    "Romarin",
  ];
  const proteins = [
    "Crabe",
    "Crevettes Végétariennes",
    "Saumon Fumé",
    "Thon cuit",
  ];
  const dressings = [
    "Huile olive à la truffe",
    "Huile olive",
    "Sauce Mirin sucrée",
    "Sauce Soja",
    "Sauce Tamari",
    "Vinaigre balsamique",
    "Vinaigre de framboise",
    "Vinaigre de riz",
    "Vinaigre de vin rouge",
  ];

  const handleToppingChange = (topping: string) => {
    setOrder((prev) => ({
      ...prev,
      toppings: prev.toppings.includes(topping)
        ? prev.toppings.filter((t) => t !== topping)
        : [...prev.toppings, topping],
    }));
  };

  const handleProteinChange = (protein: string) => {
    setOrder((prev) => ({
      ...prev,
      proteins: prev.proteins.includes(protein)
        ? prev.proteins.filter((p) => p !== protein)
        : [...prev.proteins, protein],
    }));
  };

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    isError: boolean;
    message: string;
  }>({
    isOpen: false,
    isError: false,
    message: "",
  });

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

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

      setModalState({
        isOpen: true,
        isError: false,
        message:
          "SELECT status FROM orders WHERE id = LAST_INSERT_ID(); -- SUCCESS",
      });
    } catch (error) {
      setModalState({
        isOpen: true,
        isError: true,
        message: "ROLLBACK; -- Error: Failed to print order",
      });
      console.error(error);
    }
  };

  const isOrderComplete = () => {
    return (
      order.name &&
      order.base &&
      order.proteins.length > 0 &&
      order.dressing &&
      order.toppings.length > 0
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-900 py-4 px-2 font-mono text-green-500">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          INSERT INTO salad_bowl
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
          <div className="grid grid-cols-2 gap-2">
            {proteins.map((protein) => (
              <button
                key={protein}
                onClick={() => handleProteinChange(protein)}
                className={`p-3 rounded border ${
                  order.proteins.includes(protein)
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

        {/* Modal */}
        {modalState.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border-2 border-green-500 rounded-lg p-6 w-full max-w-md">
              <div className="flex flex-col items-center">
                <div className="w-full mb-4">
                  <pre
                    className={`whitespace-pre-wrap break-words ${
                      modalState.isError ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {modalState.message}
                  </pre>
                </div>
                <button
                  onClick={closeModal}
                  className="mt-4 px-6 py-2 bg-gray-700 border border-green-500 rounded hover:bg-gray-600 text-green-500"
                >
                  EXIT;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
