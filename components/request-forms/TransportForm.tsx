"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TransportForm() {
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup_location: "",
    destination: "",
    vehicle_needed: "",
    city: "",
    state: "",
    location: "",
    urgency: "high",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
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
              category: "transport",
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
        " Transport Request Submitted Successfully"
      );

      setForm({
        name: "",
        phone: "",
        pickup_location: "",
        destination: "",
        vehicle_needed: "",
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
         Transport Request
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
        name="pickup_location"
        value={form.pickup_location}
        onChange={handleChange}
        placeholder="Pickup Location"
        required
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="destination"
        value={form.destination}
        onChange={handleChange}
        placeholder="Destination"
        required
        className="w-full border p-3 rounded-xl"
      />

      <select
        name="vehicle_needed"
        value={form.vehicle_needed}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded-xl"
      >
        <option value="">
          Vehicle Needed
        </option>
        <option value="Bike">
          Bike
        </option>
        <option value="Car">
          Car
        </option>
        <option value="Ambulance">
          Ambulance
        </option>
        <option value="Van">
          Van
        </option>
        <option value="Truck">
          Truck
        </option>
      </select>

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
        onChange={handleChange}
        placeholder="Describe transport need"
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
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : "Submit Transport Request"}
      </button>
    </form>
  );
}