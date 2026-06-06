"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const EmergencyMap = dynamic(
  () => import("@/components/EmergencyMap"),
  {
    ssr: false,
  }
);

type RequestItem = {
  id: string;
  category: string;
  description: string;
  city?: string;
  state?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  urgency?: string;
  status?: string;
  is_sos?: boolean;
};

export default function MapPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("map-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("requests")
      .select("*");

    setRequests(data || []);
    setLoading(false);
  };

  const cities = [
    ...new Set(
      requests
        .map((r) => r.city)
        .filter(Boolean)
    ),
  ];

  const states = [
    ...new Set(
      requests
        .map((r) => r.state)
        .filter(Boolean)
    ),
  ];

  const filteredRequests = requests.filter((req) => {
    const cityMatch =
      cityFilter === "all" ||
      req.city === cityFilter;

    const stateMatch =
      stateFilter === "all" ||
      req.state === stateFilter;

    const searchMatch =
      req.category
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      req.city
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      req.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return (
      cityMatch &&
      stateMatch &&
      searchMatch
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
           Emergency Resource Map
        </h1>

        <p className="text-gray-600 mt-2">
          View live emergency requests across cities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            Total Requests
          </h3>

          <p className="text-3xl font-bold">
            {requests.length}
          </p>
        </div>

        <div className="bg-red-50 rounded-xl shadow p-5">
          <h3 className="text-red-600">
            SOS Requests
          </h3>

          <p className="text-3xl font-bold">
            {
              requests.filter(
                (r) => r.is_sos
              ).length
            }
          </p>
        </div>

        <div className="bg-green-50 rounded-xl shadow p-5">
          <h3 className="text-green-600">
            Open Requests
          </h3>

          <p className="text-3xl font-bold">
            {
              requests.filter(
                (r) =>
                  r.status === "open"
              ).length
            }
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl shadow p-5">
          <h3 className="text-blue-600">
            Cities Covered
          </h3>

          <p className="text-3xl font-bold">
            {cities.length}
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">

        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-xl p-3"
          />

          <select
            value={cityFilter}
            onChange={(e) =>
              setCityFilter(e.target.value)
            }
            className="border rounded-xl p-3"
          >
            <option value="all">
              All Cities
            </option>

            {cities.map((city) => (
              <option
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </select>

          <select
            value={stateFilter}
            onChange={(e) =>
              setStateFilter(e.target.value)
            }
            className="border rounded-xl p-3"
          >
            <option value="all">
              All States
            </option>

            {states.map((state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>

        </div>

      </div>

<div className="flex gap-6 mb-4 bg-white p-4 rounded-xl shadow">

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
    <span>SOS Emergency</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
    <span>Open Request</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
    <span>Assigned</span>
  </div>

</div>



      {/* Map + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">

          <EmergencyMap
            requests={filteredRequests}
          />

        </div>

        <div className="bg-white rounded-xl shadow p-5 max-h-[600px] overflow-y-auto">

          <h2 className="font-bold text-xl mb-4">
             Live Requests
          </h2>

          {filteredRequests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="border-b py-4"
              >
                <div className="flex justify-between">

                  <strong>
                    {req.category}
                  </strong>

                  {req.is_sos && (
                    <span className="text-red-600 font-bold">
                      SOS
                    </span>
                  )}

                </div>

                <p className="text-sm text-gray-500">
                  {req.city}, {req.state}
                </p>

                <p className="text-sm mt-2">
                  {req.description}
                </p>

                <span className="inline-block mt-2 px-2 py-1 rounded bg-gray-100 text-xs">
                  {req.status}
                </span>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}