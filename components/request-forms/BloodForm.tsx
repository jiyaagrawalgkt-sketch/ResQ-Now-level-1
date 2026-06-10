"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BloodRequestPage() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    blood_group: "",
    units_required: "",
    hospital_name: "",
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
              category: "blood",

              name: form.name,
              phone: form.phone,

              blood_group:
                form.blood_group,
              units_required:
                form.units_required,
              hospital_name:
                form.hospital_name,


              urgency:
                form.urgency,

              latitude,
              longitude,

              is_sos: isSOS,
              status: "open",
              assigned_to: null,

              user_id:
                userData.user?.id ||
                null,

              description: `
Blood Group: ${form.blood_group}
Units Required: ${form.units_required}
Hospital: ${form.hospital_name}

${form.description}
              `,
            },
          ]);

      if (error) {
        throw error;
      }

      alert(
        "✅ Blood Request Submitted Successfully"
      );

      setForm({
        name: "",
        phone: "",
        blood_group: "",
        units_required: "",
        hospital_name: "",
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
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h1 className="text-4xl font-bold mb-6">
        Blood Request
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          name="name"
          value={form.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="blood_group"
          value={form.blood_group}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">
            Select Blood Group
          </option>

          <option value="A+">
            A+
          </option>

          <option value="A-">
            A-
          </option>

          <option value="B+">
            B+
          </option>

          <option value="B-">
            B-
          </option>

          <option value="AB+">
            AB+
          </option>

          <option value="AB-">
            AB-
          </option>

          <option value="O+">
            O+
          </option>

          <option value="O-">
            O-
          </option>
        </select>

        <input
          name="units_required"
          value={form.units_required}
          placeholder="Units Required"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="hospital_name"
          value={form.hospital_name}
          placeholder="Hospital Name"
          onChange={handleChange}
          className="w-full border p-3 rounded"
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
          className="w-full border p-3 rounded"
        />

        <label className="flex gap-2 items-center">
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
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Blood Request"}
        </button>
      </form>
    </div>
  );
}