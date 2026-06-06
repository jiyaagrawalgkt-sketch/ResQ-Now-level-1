"use client";

import { useState } from "react";

import BloodForm from "@/components/request-forms/BloodForm";
import FoodForm from "@/components/request-forms/FoodForm";
import MedicineForm from "@/components/request-forms/MedicineForm";
import TransportForm from "@/components/request-forms/TransportForm";
import ShelterForm from "@/components/request-forms/ShelterForm";

export default function RequestPage() {
  const [category, setCategory] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-2">
           Request Emergency Help
        </h1>

        <p className="text-gray-600 mb-8">
          Select the type of assistance you need.
        </p>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">

          <button
            onClick={() => setCategory("blood")}
            className={`p-15 rounded-2xl shadow ${
              category === "blood"
                ? "bg-pink-600 text-white"
                : "bg-white hover:bg-pink-50"
            }`}
          >
             Blood
          </button>

          <button
            onClick={() => setCategory("food")}
            className={`p-15 rounded-2xl shadow ${
              category === "food"
                ? "bg-green-600 text-white"
                : "bg-white  hover:bg-pink-50"
            }`}
          >
             Food
          </button>

          <button
            onClick={() => setCategory("medicine")}
            className={`p-15 rounded-2xl shadow ${
              category === "medicine"
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-pink-50"
            }`}
          >
             Medicine
          </button>

          <button
            onClick={() => setCategory("transport")}
            className={`p-15 rounded-2xl shadow ${
              category === "transport"
                ? "bg-yellow-500 text-white"
                : "bg-white hover:bg-pink-50"
            }`}
          >
             Transport
          </button>

          <button
            onClick={() => setCategory("shelter")}
            className={`p-15 rounded-2xl shadow ${
              category === "shelter"
                ? "bg-purple-600 text-white"
                : "bg-white hover:bg-pink-50"
            }`}
          >
             Shelter
          </button>

        </div>

        {/* Forms */}

        {category === "blood" && <BloodForm />}
        {category === "food" && <FoodForm />}
        {category === "medicine" && <MedicineForm />}
        {category === "transport" && <TransportForm />}
        {category === "shelter" && <ShelterForm />}

      </div>
    </div>
  );
}