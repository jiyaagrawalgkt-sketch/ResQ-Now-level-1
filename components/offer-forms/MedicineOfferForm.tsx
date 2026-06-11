"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MedicineOfferForm() {
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
      if (latitude === null || longitude === null){
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
          category: "medicine",
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

      alert("Medicine Offer Submitted Successfully");


      setForm({
        name: "",
        phone: "",
        medicine_type: "",
        medicine_name: "",
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
      <h2 className="text-2xl font-bold"> Offer Medicine</h2>

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
        name="medicine_type"
        value={form.medicine_type}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      >
        <option value="">Select Medicine Type</option>
        <option value="Allopathic">Allopathic</option>
        <option value="Ayurvedic">Ayurvedic</option>
        <option value="Homeopathic">Homeopathic</option>
      </select>


      <input
        name="medicine_name"
        value={form.medicine_name}
        placeholder="Medicine Name (or 'General Supplies')"
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
        placeholder="Describe the medicines/supplies you can offer"
        rows={4}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />



      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        {loading ? "Submitting..." : "Submit Medicine Offer"}
      </button>
    </form>
  );
}