"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  const [requestCount, setRequestCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [sosCount, setSosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check Admin
  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      if (user.email !== "admin@gmail.com") {
        window.location.href = "/";
        return;
      }

      setLoading(false);
    }

    checkAdmin();
  }, []);

  // Fetch Dashboard Data
  useEffect(() => {
    if (loading) return;

    async function fetchCounts() {
      const { count: requests } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true });

      const { count: offers } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true });

      const { count: sos } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("is_sos", true);

      setRequestCount(requests || 0);
      setOfferCount(offers || 0);
      setSosCount(sos || 0);
    }

    fetchCounts();
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Total Requests</h2>
            <p className="text-4xl font-bold">
              {requestCount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Total Offers</h2>
            <p className="text-4xl font-bold">
              {offerCount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>SOS Requests</h2>
            <p className="text-4xl font-bold">
              {sosCount}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}