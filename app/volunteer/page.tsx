"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VolunteerPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVolunteerDashboard();
  }, []);

  async function loadVolunteerDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("assigned_to", user.email)
      .order("created_at", { ascending: false });

    if (!error) {
      setRequests(data || []);
    }

    setLoading(false);
  }

  async function markCompleted(id: string) {
    const { error } = await supabase
      .from("requests")
      .update({
        status: "completed",
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadVolunteerDashboard();
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        Please login first.
      </div>
    );
  }

  const completedCount = requests.filter(
    (r) => r.status === "completed"
  ).length;

  const activeCount = requests.filter(
    (r) => r.status === "in_progress"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Volunteer Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          {user.email}
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-3xl font-bold text-blue-600">
            {activeCount}
          </h2>

          <p className="text-gray-600 mt-2">
            Active Assignments
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-3xl font-bold text-green-600">
            {completedCount}
          </h2>

          <p className="text-gray-600 mt-2">
            Completed Requests
          </p>
        </div>

      </div>

      {/* ASSIGNED REQUESTS */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          My Assigned Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-gray-500">
            No assigned requests yet.
          </p>
        ) : (
          <div className="space-y-4">

            {requests.map((req) => (
              <div
                key={req.id}
                className="border rounded-xl p-5"
              >

                <div className="flex justify-between mb-3">

                  <h3 className="font-bold text-lg capitalize">
                    {req.category}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      req.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>

                </div>

                <p>
                  <strong>Name:</strong> {req.name}
                </p>

                <p>
                  <strong>Phone:</strong> {req.phone}
                </p>

                <p>
                  <strong>Location:</strong> {req.location}
                </p>

                <p>
                  <strong>Urgency:</strong> {req.urgency}
                </p>

                <p className="mt-3">
                  {req.description}
                </p>

                {req.status !== "completed" && (
                  <button
                    onClick={() => markCompleted(req.id)}
                    className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl"
                  >
                     Mark Completed
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}