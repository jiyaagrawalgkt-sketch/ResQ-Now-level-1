"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BloodOfferForm() {
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    blood_group: "",
    units_available: "",
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
          category: "blood",
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

      alert(" Blood Offer Submitted");
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
      <h2 className="text-2xl font-bold"> Offer Blood</h2>

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

      <select
        name="blood_group"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      >
        <option value="">Select Blood Group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

      <input
        name="units_available"
        placeholder="Units Available"
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
        placeholder="Exact Location"
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
        placeholder="Additional Details"
        rows={4}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />


      <button
        disabled={loading}
        className="w-full bg-red-600 text-white py-3 rounded-xl"
      >
        {loading ? "Submitting..." : "Submit Blood Offer"}
      </button>
    </form>
  );
}