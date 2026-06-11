"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShelterOfferForm() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    people_count: "",
    women_count: "",
    children_count: "",
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


  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        alert(
          `Location captured!\nLat: ${position.coords.latitude}\nLng: ${position.coords.longitude}`
        );
      },
      (error) => {
        console.log(error);
        alert("Location access failed");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (latitude === null || longitude === null) {
        alert("Please click 'Use My Current Location' first");
        setLoading(false);
        return;
      }

      // Get logged-in user
      const { data: userData } = await supabase.auth.getUser();

      // Insert into Supabase
      const { error } = await supabase.from("offers").insert([
        {
          ...form,
          category: "shelter",
          latitude,
          longitude,
          is_sos: isSOS,
          status: "open",
          assigned_to: null,
          user_id: userData.user?.id || null,
        },
      ]);

      // Handle Supabase error
      if (error) {
        throw error;
      }

      alert("Shelter Offer Submitted Successfully");


      setForm({
        name: "",
        phone: "",
        people_count: "",
        women_count: "",
        children_count: "",
        urgency: "high",
        description: "",
      });


      setLatitude(null);
      setLongitude(null);
      setIsSOS(false);
    } catch (error: any) {
      console.log(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">Offer Shelter</h2>

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

      <input
        name="people_count"
        value={form.people_count}
        placeholder="Total People You Can House"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="women_count"
        value={form.women_count}
        placeholder="Can House Women (Count)"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="children_count"
        value={form.children_count}
        placeholder="Can House Children (Count)"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />


      <button
        type="button"
        onClick={getCurrentLocation}
        className="w-full bg-green-600 text-white py-3 rounded-xl"
      >
        📍 Use My Current Location
      </button>


      {latitude && longitude && (
        <p className="text-green-600 text-sm">
          ✅ Location captured successfully
        </p>
      )}


      <select
        name="urgency"
        value={form.urgency}
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