"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TransportForm() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [pickupMode, setPickupMode] = useState<"manual" | "gps" | "">("");
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup_location: "",
    destination: "",
    vehicle_needed: "",
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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!latitude || !longitude) {
        alert("Please click 'Use My Current Location' first");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase.from("requests").insert([
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

      if (error) {
        throw error;
      }

      alert("Transport Request Submitted Successfully");

      setForm({
        name: "",
        phone: "",
        pickup_location: "",
        destination: "",
        vehicle_needed: "",
        urgency: "high",
        description: "",
      });

      setIsSOS(false);
    } catch (error: any) {
      console.error(error);
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



      <div className="space-y-2">

        <label>Pickup Location Type</label>



        <select
          value={pickupMode}
          onChange={(e) => {
            const value = e.target.value;
            setPickupMode(value);

            if (value === "gps") {
              setForm((prev) => ({
                ...prev,
                pickup_location: "",
              }));
            }
          }}
          className="w-full border p-3 rounded-xl"
        >
          <option value="">Select Pickup Method</option>
          <option value="manual">Entry Location</option>
          <option value="gps">📍 GPS Location</option>
        </select>



        {pickupMode === "manual" && (
          <input
            name="pickup_location"
            value={form.pickup_location}
            onChange={handleChange}
            placeholder="Enter pickup location"
            className="w-full border p-3 rounded-xl"
            required
          />
        )}

        {pickupMode === "gps" && (
          <div>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-green-600 text-white p-3 rounded-xl"
            >
              📍 GPS
            </button>

            {latitude && longitude && (
              <p className="text-green-600 text-sm">
                ✅ Location captured successfully
              </p>
            )}
          </div>
        )}

      </div>



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