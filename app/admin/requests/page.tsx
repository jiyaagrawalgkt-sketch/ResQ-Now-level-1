"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

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
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setRequests(data || []);
    }
  }

  async function deleteRequest(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this request?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("requests")
      .delete()
      .eq("id", id);

    fetchRequests();
  }

  return (
    <div className="flex">

      <AdminSidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Manage Requests
        </h1>

        <div className="overflow-x-auto">

          <table className="w-full bg-white shadow rounded-lg">

            <thead className="bg-red-500 text-white">

              <tr>
                <th className="p-3">Name</th>
                <th>Blood</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>SOS</th>
                <th>Map</th>
                <th>Delete</th>
              </tr>

            </thead>

            <tbody>

              {requests.map((item) => (

                <tr
  key={item.id}
  className={`text-center border-b ${
    item.is_sos ? "bg-red-100" : ""
  }`}
>

                  <td className="p-3">
                    {item.name}
                  </td>

                  <td>
                    {item.blood_group}
                  </td>

                  <td>
                    {item.units_required}
                  </td>

                  <td>
                    {item.urgency}
                  </td>

                  <td>

<select
  value={item.status}
  onChange={async (e) => {
    await supabase
      .from("requests")
      .update({
        status: e.target.value,
      })
      .eq("id", item.id);

    fetchRequests();
  }}
  className="border p-1 rounded"
>

  <option value="Pending">
    Pending
  </option>

  <option value="Assigned">
    Assigned
  </option>

  <option value="Completed">
    Completed
  </option>

</select>

</td>

 <td>

<input
  type="text"
  defaultValue={item.assigned_to || ""}
  placeholder="Volunteer Name"
  className="border rounded p-1"

  onBlur={async (e) => {
    await supabase
      .from("requests")
      .update({
        assigned_to: e.target.value,
      })
      .eq("id", item.id);

    fetchRequests();
  }}
/>

</td>
<td>

<a
  href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
  target="_blank"
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  View
</a>

</td>

                  <td>

                    <button
                      onClick={() => deleteRequest(item.id)}
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