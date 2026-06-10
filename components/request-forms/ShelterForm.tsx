"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShelterForm() {
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


  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("SUCCESS:", position);

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        alert(
          "Location captured!\n" +
          "Lat: " + position.coords.latitude + "\n" +
          "Lng: " + position.coords.longitude
        );
      },
      (error) => {
        console.log("ERROR:", error);

        alert(
          "Location failed. Error code: " + error.code +
          "\n1 = permission denied\n2 = position unavailable\n3 = timeout"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);


    try {
      if (latitude === null || longitude === null) {
        alert("Please click 'Use My Current Location' first");
        return;
      }


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


      <button
        type="button"
        onClick={getCurrentLocation}
        className="w-full bg-blue-600 text-white p-3 rounded-xl"
      >
        📍 Use My Current Location
      </button>

      {latitude && longitude && (
        <p className="text-green-600 text-sm">
          ✅ Location captured successfully
        </p>
      )}


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