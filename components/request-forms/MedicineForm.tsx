"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MedicineForm() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    medicine_type: "",
    medicine_name: "",
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


      // Get logged in user
      const { data: userData } =
        await supabase.auth.getUser();

      const { error } =
        await supabase
          .from("requests")
          .insert([
            {
              ...form,
              category: "medicine",
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
        " Medicine Request Submitted Successfully"
      );

      // Reset form
      setForm({
        name: "",
        phone: "",
        medicine_type: "",
        medicine_name: "",
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
        Medicine Request
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

      <select
        name="medicine_type"
        value={form.medicine_type}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded-xl"
      >
        <option value="">
          Select Medicine Type
        </option>
        <option value="Allopathic">
          Allopathic
        </option>
        <option value="Ayurvedic">
          Ayurvedic
        </option>
        <option value="Homeopathic">
          Homeopathic
        </option>
      </select>

      <input
        name="medicine_name"
        value={form.medicine_name}
        onChange={handleChange}
        placeholder="Medicine Name"
        required
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
        onChange={handleChange}
        placeholder="Describe the medicine requirement..."
        rows={4}
        className="w-full border p-3 rounded-xl"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isSOS}
          onChange={(e) =>
            setIsSOS(
              e.target.checked
            )
          }
        />
        SOS Emergency
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : "Submit Medicine Request"}
      </button>
    </form>
  );
}