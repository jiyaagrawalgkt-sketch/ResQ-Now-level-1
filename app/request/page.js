"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RequestPage() {
  const [loading, setLoading] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [form, setForm] = useState({
  name: "",
  phone: "",
  category: "blood",
  city: "",
  state: "",
  location: "",
  urgency: "high",
  description: "",
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Get logged in user
      const user = await supabase.auth.getUser();

      const { error } = await supabase
        .from("requests")
        .insert([
          {
  name: form.name,
  phone: form.phone,
  category: form.category,

  city: form.city,
  state: form.state,
  location: form.location,

  urgency: form.urgency,
  description: form.description,

  status: "open",
  assigned_to: null,

  user_id: user.data.user?.id || null,

  is_sos: isSOS,
},
        ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert("🚨 Request Submitted Successfully");

      setForm({
  name: "",
  phone: "",
  category: "blood",
  city: "",
  state: "",
  location: "",
  urgency: "high",
  description: "",
});

      setIsSOS(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-2xl mx-auto">

        <div className="bg-white shadow-lg rounded-2xl p-8">

          <h1 className="text-3xl font-bold mb-2">
            🚨 Emergency Request
          </h1>

          <p className="text-gray-600 mb-8">
            Submit a request for blood, food, medicine,
            transport, shelter, or any urgent assistance.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3"
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 font-medium">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3"
                placeholder="Enter phone number"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium">
                Resource Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="blood">
                  🩸 Blood
                </option>

                <option value="food">
                  🍱 Food
                </option>

                <option value="medicine">
                  💊 Medicine
                </option>

                <option value="transport">
                  🚗 Transport
                </option>

                <option value="shelter">
                  🏠 Shelter
                </option>
              </select>
            </div>


            <div>
  <label className="block mb-2 font-medium">
    City
  </label>

  <input
    type="text"
    name="city"
    value={form.city}
    onChange={handleChange}
    className="w-full border rounded-xl p-3"
    placeholder="Bhopal"
    required
  />
</div>

<div>
  <label className="block mb-2 font-medium">
    State
  </label>

  <input
    type="text"
    name="state"
    value={form.state}
    onChange={handleChange}
    className="w-full border rounded-xl p-3"
    placeholder="Madhya Pradesh"
    required
  />
</div>

            {/* Location */}
            <div>
              <label className="block mb-2 font-medium">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3"
                placeholder="Bhopal, MP"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block mb-2 font-medium">
                Urgency
              </label>

              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="high">
                  🚨 High
                </option>

                <option value="medium">
                  ⚠️ Medium
                </option>

                <option value="low">
                  🙂 Low
                </option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border rounded-xl p-3"
                placeholder="Describe your emergency..."
              />
            </div>

            {/* SOS */}
            <div className="bg-red-50 border border-red-300 rounded-xl p-4">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={isSOS}
                  onChange={(e) =>
                    setIsSOS(e.target.checked)
                  }
                />

                <span className="font-semibold text-red-600">
                  🚨 Mark as SOS Emergency
                </span>

              </label>

              <p className="text-sm text-gray-600 mt-2">
                SOS requests are prioritized and shown
                at the top of volunteer feeds.
              </p>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading
                ? "Submitting..."
                : "Submit Emergency Request"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}