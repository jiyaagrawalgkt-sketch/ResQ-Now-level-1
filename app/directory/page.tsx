"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DirectoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    const { data } = await supabase
      .from("emergency_directory")
      .select("*")
      .order("Name");

    setItems(data || []);
  };

  const filteredItems =
    filter === "all"
      ? items
      : items.filter(
          (item) => item.category === filter
        );

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-2">
         Emergency Directory
      </h1>

      <p className="text-gray-600 mb-8">
        Hospitals, NGOs, Blood Banks, Medical Store &
        Shelters
      </p>

      <div className="flex flex-wrap gap-3 mb-8">

        {[
          "All",
          "Hospital",
          "NGO",
          "Blood Bank",
          "Medical Store",
          "Shelter",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-xl ${
              filter === item
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {item}
          </button>
        ))}

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-3">
              {item.Name}
            </h2>

            <p>
              <strong>Category:</strong>{" "}
              {item.category}
            </p>

            <p>
              <strong>Contact:</strong>{" "}
              {item.Contact}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {item.city}
            </p>

            <p>
              <strong>Type:</strong>{" "}
              {item.Type}
            </p>

            <p>
              <strong>pincode:</strong>{" "}
              {item.pincode}
            </p>

            <p className="mt-2">
              {item.address}
            </p>

            <a
              href={`tel:${item.Contact}`}
              className="block mt-5 text-center bg-blue-600 text-white py-3 rounded-xl"
            >
               Call Now
            </a>
          </div>
        ))}

      </div>

    </div>
  );
}