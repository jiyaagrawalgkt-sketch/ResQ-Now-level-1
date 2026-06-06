"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FoodOfferForm() {
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    food_type: "",
    quantity: "",
    city: "",
    state: "",
    location: "",
    urgency: "high",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
          category: "food",
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

      alert(" Food Offer Submitted");
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
      <h2 className="text-2xl font-bold"> Offer Food</h2>

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
        name="food_type"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      >
        <option value="">Select Food Type</option>
        <option value="Homemade Food">Homemade Food</option>
        <option value="Restaurant Food">Restaurant Food</option>
        <option value="Packed Food">Packed Food</option>
        <option value="Baby Food">Baby Food</option>
        <option value="Dry Ration">Dry Ration</option>
      </select>

      <input
        name="quantity"
        placeholder="Number of People You Can Feed"
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
        placeholder="Exact Location / Pickup Point"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
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
        placeholder="Additional Details (e.g. dietary restrictions, delivery available?)"
        rows={4}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      

      <button
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-xl"
      >
        {loading ? "Submitting..." : "Submit Food Offer"}
      </button>
    </form>
  );
}