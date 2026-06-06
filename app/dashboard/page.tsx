"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const email = user.email;
      const userId = user.id;

      // My own requests (created by me)
      const { data: myReqs } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      // Requests I volunteered to help with
      const { data: accepted } = await supabase
        .from("requests")
        .select("*")
        .eq("assigned_to", email)
        .order("created_at", { ascending: false });

      // Resources I've offered
      const { data: myOffers } = await supabase
        .from("resource_offers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setMyRequests(myReqs || []);
      setAcceptedRequests(accepted || []);
      setOffers(myOffers || []);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const openCount = myRequests.filter((r) => r.status === "open").length;
  const progressCount = myRequests.filter((r) => r.status === "in_progress").length;
  const completedCount = myRequests.filter((r) => r.status === "completed").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Please login first.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Welcome Back </h1>
        <p className="text-gray-600 mt-2">{user.email}</p>
      </div>

      {/* ── MY REQUESTS STATS ── */}
      <h2 className="text-xl font-bold mb-4 text-gray-700">
         My Requests
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-4">

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-red-600 text-3xl font-bold">{openCount}</h3>
          <p className="text-gray-600 mt-2">Open Requests</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-yellow-500 text-3xl font-bold">{progressCount}</h3>
          <p className="text-gray-600 mt-2">In Progress</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-green-600 text-3xl font-bold">{completedCount}</h3>
          <p className="text-gray-600 mt-2">Completed</p>
        </div>

      </div>

      {/* ── VOLUNTEER STATS ── */}
      <h2 className="text-xl font-bold mb-4 text-gray-700">
         My Volunteer Activity
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-blue-600 text-3xl font-bold">
            {acceptedRequests.length}
          </h3>
          <p className="text-gray-600 mt-2">Accepted Requests</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-purple-600 text-3xl font-bold">
            {offers.length}
          </h3>
          <p className="text-gray-600 mt-2">Resources Offered</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-orange-500 text-3xl font-bold">
            {acceptedRequests.length + offers.length}
          </h3>
          <p className="text-gray-600 mt-2">Total Contributions</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-2xl p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">

          <Link href="/request">
            <button className="bg-red-600 text-white px-5 py-3 rounded-xl">
               Create Request
            </button>
          </Link>

          <Link href="/requests">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">
               Volunteer Board
            </button>
          </Link>

          <Link href="/profile">
            <button className="bg-gray-800 text-white px-5 py-3 rounded-xl">
               Profile
            </button>
          </Link>

        </div>
      </div>

      {/* My Recent Requests */}
      <div className="bg-white shadow rounded-2xl p-6 mb-10">
        <h2 className="text-2xl font-bold mb-6">My Recent Requests</h2>

        {myRequests.length === 0 ? (
          <p className="text-gray-500">No requests created yet.</p>
        ) : (
          <div className="space-y-4">
            {myRequests.slice(0, 5).map((req) => (
              <div key={req.id} className="border rounded-xl p-4">
                <div className="flex justify-between">

                  <div>
                    <h3 className="font-bold capitalize">{req.category}</h3>
                    <p className="text-gray-600 text-sm">{req.location}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm h-fit ${
                      req.status === "open"
                        ? "bg-red-100 text-red-600"
                        : req.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {req.status}
                  </span>

                </div>
                <p className="mt-3 text-gray-700">{req.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Requests (Volunteer) */}
      <div className="bg-white shadow rounded-2xl p-6 mb-10">
        <h2 className="text-2xl font-bold mb-6"> Requests I'm Helping With</h2>

        {acceptedRequests.length === 0 ? (
          <p className="text-gray-500">You haven't accepted any requests yet.</p>
        ) : (
          <div className="space-y-4">
            {acceptedRequests.slice(0, 5).map((req) => (
              <div key={req.id} className="border rounded-xl p-4">
                <div className="flex justify-between">

                  <div>
                    <h3 className="font-bold capitalize">{req.category}</h3>
                    <p className="text-gray-600 text-sm">{req.location}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 h-fit">
                    {req.status}
                  </span>

                </div>
                <p className="mt-3 text-gray-700">{req.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Resource Offers */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6"> My Resource Offers</h2>

        {offers.length === 0 ? (
          <p className="text-gray-500">You haven't offered any resources yet.</p>
        ) : (
          <div className="space-y-4">
            {offers.slice(0, 5).map((offer) => (
              <div key={offer.id} className="border rounded-xl p-4">
                <div className="flex justify-between">

                  <div>
                    <h3 className="font-bold capitalize">{offer.category}</h3>
                    <p className="text-gray-600 text-sm">{offer.city}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 h-fit">
                    {offer.availability ?? "Available"}
                  </span>

                </div>
                <p className="mt-3 text-gray-700">{offer.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}