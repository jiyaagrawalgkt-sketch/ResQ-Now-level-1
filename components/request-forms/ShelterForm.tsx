"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShelterForm() {
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
    urgency: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const searchQuery = form.location?.trim()
        ? `${form.location}, ${form.city}, ${form.state}`
        : `${form.city}, ${form.state}`;

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`,
        {
          headers: {
            "User-Agent":
              "Emergency-Resource-Platform",
          },
        }
      );

      const geoData = await geoRes.json();

      const latitude =
        geoData?.[0]?.lat
          ? Number(geoData[0].lat)
          : null;

      const longitude =
        geoData?.[0]?.lon
          ? Number(geoData[0].lon)
          : null;

      const { data: userData } =
        await supabase.auth.getUser();

      const { error } =
        await supabase
          .from("requests")
          .insert([
            {
              ...form,
              category: "shelter",
              latitude,
              longitude,
              is_sos: isSOS,
              status: "open",
              assigned_to: null,
              user_id:
                userData.user?.id ||
                null,
            },
          ]);

      if (error) {
        throw error;
      }

      alert(
        " Shelter Request Submitted Successfully"
      );

      setForm({
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

      setIsSOS(false);
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">
         Shelter Request
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="people_count"
        value={form.people_count}
        onChange={handleChange}
        placeholder="Total People"
        required
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="women_count"
        value={form.women_count}
        onChange={handleChange}
        placeholder="Women Count"
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="children_count"
        value={form.children_count}
        onChange={handleChange}
        placeholder="Children Count"
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        required
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State"
        required
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Exact Location"
        className="w-full border p-3 rounded-xl"
      />

  

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Describe shelter requirement"
        rows={4}
        className="w-full border p-3 rounded-xl"
      />

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={isSOS}
          onChange={(e) =>
            setIsSOS(e.target.checked)
          }
        />
        SOS Emergency
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : "Submit Shelter Request"}
      </button>
    </form>
  );
}