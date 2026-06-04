"use client";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const logout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/";
  };

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}