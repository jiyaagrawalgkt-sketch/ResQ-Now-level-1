"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FoodRequestPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    food_type: "",
    quantity: "",
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
      if (!latitude || !longitude) {
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
              category: "food",
              name: form.name,
              phone: form.phone,
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