"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReviewPage() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReview() {
  if (!name || !message) {
    alert("Please fill all fields");
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase
  .from("reviews")
  .insert({
  name,
  email: user.email,
  rating,
  message,
  user_id: user.id,
})
  .select();

console.log("USER =", user);
console.log("DATA =", data);
console.log("ERROR =", error);

setLoading(false);

if (error) {
  alert(error.message);
} else {
    alert("Review Submitted!");

    setName("");
    setRating(5);
    setMessage("");
  }
}
  return (
    <div className="max-w-lg mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Give Your Feedback</h1>

      <input
        className="border w-full p-2 mb-4"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* FIXED rating input */}
      <select
  className="border w-full p-2 mb-4"
  value={rating}
  onChange={(e) => setRating(Number(e.target.value))}
>
  <option value={1}>1 ⭐</option>
  <option value={2}>2 ⭐⭐</option>
  <option value={3}>3 ⭐⭐⭐</option>
  <option value={4}>4 ⭐⭐⭐⭐</option>
  <option value={5}>5 ⭐⭐⭐⭐⭐</option>
</select>

      <textarea
        className="border w-full p-2 mb-4"
        placeholder="Write your review"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}