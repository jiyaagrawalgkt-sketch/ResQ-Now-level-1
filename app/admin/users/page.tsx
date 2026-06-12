"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
  const { data, error } = await supabase
    .from("requests")
    .select("*");

  console.log("DATA =", data);
  console.log("ERROR =", error);

  if (data) {
    setUsers(data);
  }
}

  async function deleteUser(id: number) {
    const ok = confirm(
      "Delete this user?"
    );

    if (!ok) return;

    await supabase
      .from("requests")
      .delete()
      .eq("id", id);

    fetchUsers();
  }

  return (
    <div className="flex">

      <AdminSidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Manage Users
        </h1>

        <div className="overflow-x-auto">

          <table className="w-full bg-white rounded-lg shadow">

            <thead className="bg-blue-600 text-white">
  <tr>
    <th className="p-3">Name</th>
    <th>Phone</th>
    <th>Location</th>
    <th>Delete</th>
  </tr>
</thead>

<tbody>
  {users.map((user) => (
    <tr
      key={user.id}
      className="text-center border-b"
    >
      <td className="p-3">
        {user.name}
      </td>

      <td>
        {user.phone}
      </td>

      <td>
        {user.location}
      </td>

      <td>
        <button
          onClick={() => deleteUser(user.id)}
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