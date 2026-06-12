"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="w-60 min-h-screen bg-red-600 text-white p-5">

      <h1 className="text-2xl font-bold mb-8">
        ResQNow
      </h1>

      <div className="flex flex-col gap-4">

        <Link href="/admin">Dashboard</Link>

        <Link href="/admin/users">Users</Link>

        <Link href="/admin/requests">Requests</Link>

        <Link href="/admin/offers">Offers</Link>

        <Link href="/admin/reviews">Reviews</Link>

      </div>

    </div>
  );
}