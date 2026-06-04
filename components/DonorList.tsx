"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DonorList() {
  const [donors, setDonors] = useState<any[]>([]);

  useEffect(() => {
    fetchDonors();
  }, []);

  async function fetchDonors() {
    const { data } = await supabase
      .from("blood_donors")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setDonors(data || []);
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-4">
        Available Donors
      </h2>

      <div className="grid gap-4">
        {donors.map((donor) => (
          <div
            key={donor.id}
            className="border p-4 rounded-lg"
          >
            <h3 className="font-bold">
              {donor.full_name}
            </h3>

            <p>
              Blood Group:
              {donor.blood_group}
            </p>

            <p>City: {donor.city}</p>

            <p>Phone: {donor.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}