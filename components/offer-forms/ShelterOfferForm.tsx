"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShelterOfferForm() {
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    people_count: "",
    women_count: "",
    children_count: "",
    city: "",
    state: "",
    location: "",
    urgency: "high",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${form.location}, ${form.city}, ${form.state}`
        )}`
      );
      const geoData = await geoRes.json();
      const user = await supabase.auth.getUser();

      const { error } = await supabase.from("offers").insert([
        {
          ...form,
          category: "shelter",
          latitude: geoData?.[0]?.lat || null,
          longitude: geoData?.[0]?.lon || null,
          is_sos: isSOS,
          status: "open",
          assigned_to: null,
          user_id: user.data.user?.id || null,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert(" Shelter Offer Submitted");
    } catch {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">Offer Shelter</h2>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        name="people_count"
        placeholder="Total People You Can House"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="women_count"
        placeholder="Can House Women (Count)"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="children_count"
        placeholder="Can House Children (Count)"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        name="state"
        placeholder="State"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        name="location"
        placeholder="Exact Location / Address"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <select
        name="urgency"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      >
        <option value="">Urgency</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <textarea
        name="description"
        placeholder="Describe shelter details (e.g. rooms available, facilities, duration)"
        rows={4}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      

      <button
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 rounded-xl"
      >
        {loading ? "Submitting..." : "Submit Shelter Offer"}
      </button>
    </form>
  );
}