"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRequests() {
      const { data, error } = await supabase
        .from("requests")
        .select("*");

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setData(data || []);
      }
    }

    fetchRequests();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        Supabase Test
      </h1>

      {data.map((item) => (
        <div
          key={item.id}
          className="border p-3 rounded mb-3"
        >
          <pre>{JSON.stringify(item, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}