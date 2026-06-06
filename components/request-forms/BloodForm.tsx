"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BloodRequestPage() {
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    blood_group: "",
    units_required: "",
    hospital_name: "",
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
              category: "blood",

              name: form.name,
              phone: form.phone,

              blood_group:
                form.blood_group,
              units_required:
                form.units_required,
              hospital_name:
                form.hospital_name,

              city: form.city,
              state: form.state,
              location:
                form.location,

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

        <input
          name="city"
          value={form.city}
          placeholder="City"
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="state"
          value={form.state}
          placeholder="State"
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="location"
          value={form.location}
          placeholder="Exact Location"
          onChange={handleChange}
          className="w-full border p-3 rounded"
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