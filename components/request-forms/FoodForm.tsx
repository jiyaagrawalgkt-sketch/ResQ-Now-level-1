"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FoodRequestPage() {
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
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
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
              category: "food",
              name: form.name,
              phone: form.phone,
              city: form.city,
              state: form.state,
              location: form.location,
              urgency: form.urgency,

              food_type: form.food_type,
              quantity: form.quantity,

              latitude,
              longitude,

              is_sos: isSOS,
              status: "open",
              assigned_to: null,

              user_id:
                userData.user?.id ||
                null,

              description: `
Food Type: ${form.food_type}
Quantity: ${form.quantity}

${form.description}
              `,
            },
          ]);

      if (error) {
        throw error;
      }

      alert(
        " Food Request Submitted Successfully"
      );

      setForm({
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
         Food Request
      </h2>

      <input
        name="name"
        value={form.name}
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        name="phone"
        value={form.phone}
        placeholder="Phone Number"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <select
        name="food_type"
        value={form.food_type}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      >
        <option value="">
          Select Food Type
        </option>

        <option value="Homemade Food">
          Homemade Food
        </option>

        <option value="Restaurant Food">
          Restaurant Food
        </option>

        <option value="Packed Food">
          Packed Food
        </option>

        <option value="Baby Food">
          Baby Food
        </option>

        <option value="Dry Ration">
          Dry Ration
        </option>
      </select>

      <input
        name="quantity"
        value={form.quantity}
        placeholder="Number of People"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="city"
        value={form.city}
        placeholder="City"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        name="state"
        value={form.state}
        placeholder="State"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        name="location"
        value={form.location}
        placeholder="Exact Location"
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
        value={form.description}
        placeholder="Additional Details"
        rows={4}
        onChange={handleChange}
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
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : "Submit Food Request"}
      </button>
    </form>
  );
}