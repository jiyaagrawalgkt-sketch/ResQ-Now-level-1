"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OfferPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "blood",
    city: "",
    state: "",
    location: "",
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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = await supabase.auth.getUser();

      const { error } = await supabase
        .from("resource_offers")
        .insert([
          {
            name: form.name,
            phone: form.phone,
            category: form.category,

            city: form.city,
            state: form.state,
            location: form.location,

            description: form.description,

            availability: "available",

            user_id:
              user.data.user?.id || null,
          },
        ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "✅ Resource Offer Submitted Successfully"
      );

      setForm({
        name: "",
        phone: "",
        category: "blood",
        city: "",
        state: "",
        location: "",
        description: "",
      });
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
            🤝 Offer Help
          </h1>

          <p className="text-gray-600 mb-8">
            Share resources that can help
            people during emergencies.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

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
                placeholder="Your Name"
              />
            </div>

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
                placeholder="Phone Number"
              />
            </div>

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
                required
                className="w-full border rounded-xl p-3"
                placeholder="Bhopal"
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
                required
                className="w-full border rounded-xl p-3"
                placeholder="Madhya Pradesh"
              />
            </div>

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
                placeholder="Exact Location"
              />
            </div>

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
                placeholder="Describe what help you can provide..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Submitting..."
                : "Offer Resource"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}