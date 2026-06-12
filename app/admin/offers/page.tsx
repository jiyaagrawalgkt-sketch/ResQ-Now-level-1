"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email !== "admin@gmail.com") {
      window.location.href = "/";
    }
  }

  checkAdmin();
}, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setOffers(data || []);
    }
  }

  async function deleteOffer(id: number) {
    const ok = confirm(
      "Are you sure you want to delete this offer?"
    );

    if (!ok) return;

    await supabase
      .from("offers")
      .delete()
      .eq("id", id);

    fetchOffers();
  }

  return (
    <div className="flex">

      <AdminSidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Manage Offers
        </h1>

        <div className="overflow-x-auto">

          <table className="w-full bg-white rounded-lg shadow">

            <thead className="bg-green-600 text-white">

              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Category</th>
                <th>Location</th>
                <th>Delete</th>
              </tr>

            </thead>

            <tbody>

              {offers.map((offer) => (

                <tr
                  key={offer.id}
                  className="text-center border-b"
                >

                  <td className="p-3">
                    {offer.name}
                  </td>

                  <td>
                    {offer.email}
                  </td>

                  <td>
                    {offer.phone}
                  </td>

                  <td>
                    {offer.category}
                  </td>

                  <td>
                    {offer.location}
                  </td>

                  <td>

                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}