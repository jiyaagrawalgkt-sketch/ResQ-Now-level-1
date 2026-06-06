"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      alert(authError.message);
      return;
    }

    const user = authData?.user;

    if (!user) {
      alert("Signup failed. Please try again.");
      return;
    }

    // 2. Create profile in DB
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          full_name: fullName,
          phone,
          role,
        },
      ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    // 3. Go to homepage (user is already logged in if email confirm OFF)
    alert("Account created successfully!");
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="p-6 rounded-xl shadow-md w-96 space-y-3 bg-white"
      >
        <h1 className="text-xl font-bold">Create Account</h1>

        <input
          className="w-full border p-2"
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="volunteer">Volunteer</option>
        </select>

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}