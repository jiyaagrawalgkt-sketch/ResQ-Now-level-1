"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

type Review = {
  id: number;
  name: string;
  rating: number;
  message: string;
  created_at: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email !== "admin@gmail.com") {
      window.location.href = "/";
    }
  }

  checkAdmin();
}, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Fetch error:", error.message);
    } else {
      setReviews(data || []);
    }

    setLoading(false);
  }

  async function deleteReview(id: number) {
    const confirmDelete = confirm("Delete this review?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      fetchReviews();
    }
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          Customer Reviews
        </h1>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="text-center border-b">
                  <td>{review.name}</td>
                  <td>⭐ {review.rating}</td>
                  <td>{review.message}</td>
                  <td>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}