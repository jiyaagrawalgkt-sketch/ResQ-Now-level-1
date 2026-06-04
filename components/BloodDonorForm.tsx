"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BloodDonorForm() {
  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [lastDonationDate, setLastDonationDate] = useState("");

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Please login first");
        return;
      }

      const { error } = await supabase.from("blood_donors").insert([
        {
          user_id: user.id,
          full_name: fullName,
          blood_group: bloodGroup,
          age: Number(age),
          phone,
          city,
          last_donation_date: lastDonationDate || null,
          available: true,
        },
      ]);

      if (error) {
        alert(error.message);
        console.log(error);
        return;
      }

      alert("Donor Added Successfully");

      setFullName("");
      setBloodGroup("");
      setAge("");
      setPhone("");
      setCity("");
      setLastDonationDate("");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Register as Blood Donor
      </h2>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <select
        className="w-full border p-3 rounded mb-3"
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
      >
        <option value="">Select Blood Group</option>
        <option>A+</option>
        <option>A-</option>
        <option>B+</option>
        <option>B-</option>
        <option>AB+</option>
        <option>AB-</option>
        <option>O+</option>
        <option>O-</option>
      </select>

      <input
        className="w-full border p-3 rounded mb-3"
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded mb-4"
        type="date"
        value={lastDonationDate}
        onChange={(e) => setLastDonationDate(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-red-600 text-white px-6 py-3 rounded w-full"
      >
        Save Donor
      </button>
    </div>
  );
}