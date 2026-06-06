"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RequestItem = {
  id: string;
  name: string;
  phone: string;
  category: string;
  city?: string;
  state?: string;
  location: string;
  urgency: string;
  description: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
  is_sos?: boolean;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
    fetchOffers();

    const requestsChannel = supabase
      .channel("requests-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "requests" },
        () => { fetchRequests(); }
      )
      .subscribe();

    const offersChannel = supabase
      .channel("offers-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resource_offers" },
        () => { fetchOffers(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(offersChannel);
    };
  }, []);

  const fetchOffers = async () => {
    const { data } = await supabase.from("resource_offers").select("*");
    setOffers(data || []);
  };

  const fetchRequests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("is_sos", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error) {
      setRequests(data || []);
    }

    setLoading(false);
  };

  const handleHelp = async (id: string) => {
    const user = await supabase.auth.getUser();
    const email = user.data.user?.email;

    if (!email) {
      alert("Please login first.");
      return;
    }

    const { error } = await supabase
      .from("requests")
      .update({ status: "in_progress", assigned_to: email })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert(" Request accepted successfully");
  };

  const cities = [
    ...new Set(requests.map((r: any) => r.city).filter(Boolean)),
  ];

  const filteredRequests = requests.filter((request: any) => {
    const categoryMatch = filter === "all" || request.category === filter;
    const cityMatch = cityFilter === "all" || request.city === cityFilter;
    return categoryMatch && cityMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <h1 className="text-2xl font-bold">Loading Requests...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold"> Emergency Requests</h1>
          <p className="text-gray-600 mt-2">
            Help people in need by accepting requests.
          </p>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "blood", "food", "medicine", "transport", "shelter"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-xl capitalize transition ${
                  filter === item
                    ? "bg-red-600 text-white"
                    : "bg-white border"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* CITY FILTER */}
        <div className="mb-8">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="border rounded-xl px-4 py-2 bg-white"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* REQUESTS */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow">
            No requests found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/*  FIXED: Single .map() call with matchingOffers computed inside */}
            {filteredRequests.map((req) => {
              const matchingOffers = offers.filter(
                (offer) =>
                  offer.category === req.category &&
                  offer.city === req.city &&
                  offer.availability === "available"
              );

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
                >
                  {/* SOS Badge */}
                  {req.is_sos && (
                    <div className="mb-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full animate-pulse text-sm font-semibold">
                         SOS EMERGENCY
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="font-bold text-xl uppercase">
                      {req.category}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.urgency === "high"
                          ? "bg-red-100 text-red-700"
                          : req.urgency === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong> Name:</strong> {req.name}
                    </p>
                    <p>
                      <strong> Phone:</strong> {req.phone}
                    </p>
                    <div>
                    <p>
                      <strong> Location:</strong> {req.location}
                      {req.city && (
                        <div className="text-sm text-gray-500">
                          {req.city}
                          {req.state ? `, ${req.state}` : ""}
                        </div>
                      )}
                    </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-gray-600">{req.description}</p>
                  </div>

                  {/* Status */}
                  <div className="mt-5 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === "open"
                          ? "bg-red-100 text-red-700"
                          : req.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {req.status}
                    </span>
                    {req.assigned_to && (
                      <span className="text-xs text-gray-500">
                        Assigned: {req.assigned_to}
                      </span>
                    )}
                  </div>

                  {/* Matching Offers */}
                  {matchingOffers.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h3 className="font-semibold text-green-700 mb-3">
                         Matching Resources
                      </h3>
                      {matchingOffers.slice(0, 3).map((offer) => (
                        <div
                          key={offer.id}
                          className="bg-green-50 rounded-lg p-3 mb-2"
                        >
                          <p className="font-medium">{offer.name}</p>
                          <p className="text-sm text-gray-600">
                             {offer.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                             {offer.city}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleHelp(req.id)}
                    disabled={req.status !== "open"}
                    className={`mt-5 w-full py-3 rounded-xl font-semibold transition ${
                      req.status === "open"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {req.status === "open" ? " I Can Help" : "Already Assigned"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}