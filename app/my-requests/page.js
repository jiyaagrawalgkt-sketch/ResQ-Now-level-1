"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    const user = await supabase.auth.getUser();

    const { data } = await supabase
      .from("requests")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: false });

    setRequests(data || []);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">My Requests 📋</h1>

      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-bold">{req.category}</h2>
            <p>{req.description}</p>
            <p className="text-sm text-gray-500">
              Status: {req.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}