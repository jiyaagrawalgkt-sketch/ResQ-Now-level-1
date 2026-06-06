"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Offer = {
  id: string;
  name: string;
  phone: string;
  category: string;
  city: string;
  state: string;
  location: string;
  description: string;
  availability: string;
  created_at: string;
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOffers();

    const channel = supabase
      .channel("offers-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resource_offers",
        },
        () => {
          fetchOffers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOffers = async () => {
  try {
    setLoading(true);

    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) throw error;

    setOffers(data || []);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};

  const filteredOffers =
    filter === "all"
      ? offers
      : offers.filter(
          (offer) => offer.category === filter
        );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold">
          Loading Resources...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-8">

        <h1 className="text-4xl font-bold mb-2">
           Available Resources
        </h1>

        <p className="text-gray-600 mb-8">
          People offering help during emergencies.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">

          {[
            "all",
            "blood",
            "food",
            "medicine",
            "transport",
            "shelter",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-xl capitalize ${
                filter === item
                  ? "bg-green-600 text-white"
                  : "bg-white border"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            No resources available.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl shadow p-6 border hover:shadow-lg transition"
              >

                <div className="flex justify-between mb-4">

                  <h2 className="font-bold text-xl uppercase">
                    {offer.category}
                  </h2>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Available
                  </span>

                </div>

                <p>
                  <strong></strong> {offer.name}
                </p>

                <p>
                  <strong></strong> {offer.phone}
                </p>

                <p>
                  <strong></strong> {offer.city}, {offer.state}
                </p>

                <p className="text-sm text-gray-500">
                  {offer.location}
                </p>

                <div className="mt-4">
                  <p>{offer.description}</p>
                </div>

                <a
                  href={`tel:${offer.phone}`}
                  className="block text-center mt-5 bg-green-600 text-white py-3 rounded-xl font-semibold"
                >
                  Contact Provider
                </a>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}