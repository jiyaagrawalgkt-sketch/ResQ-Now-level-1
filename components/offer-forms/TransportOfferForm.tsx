"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TransportOfferForm() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle_type: "",
    seats_available: "",
    service_area: "",
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
      if (!latitude || !longitude) {
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
          category: "transport",
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

      alert("Transport Offer Submitted Successfully");


      setForm({
        name: "",
        phone: "",
        vehicle_type: "",
        seats_available: "",
        service_area: "",
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
      <h2 className="text-2xl font-bold"> Offer Transport</h2>

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
        name="vehicle_type"
        value={form.vehicle_type}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      >
        <option value="">Select Vehicle Type</option>
        <option value="Bike">Bike</option>
        <option value="Car">Car</option>
        <option value="Ambulance">Ambulance</option>
        <option value="Van">Van</option>
        <option value="Truck">Truck</option>
        <option value="Boat">Boat</option>
      </select>

      <input
        name="seats_available"
        value={form.seats_available}
        placeholder="Seats / Capacity Available"
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <input
        name="service_area"
        value={form.service_area}
        placeholder="Area / Route You Can Cover"
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
        placeholder="Describe your transport offer (availability, restrictions, etc.)"
        rows={4}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />



      <button
        disabled={loading}
        className="w-full bg-yellow-500 text-white py-3 rounded-xl"
      >
        {loading ? "Submitting..." : "Submit Transport Offer"}
      </button>
    </form>
  );
}