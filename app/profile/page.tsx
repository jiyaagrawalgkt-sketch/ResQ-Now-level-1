"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    role: "",
    updated_at: "",
  });

  const [userEmail, setUserEmail] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const loadedProfile = {
          full_name: data.full_name || "",
          phone: data.phone || "",
          role: data.role || "",
          updated_at: data.updated_at || "",
        };

        setProfile(loadedProfile);
        setTempProfile(loadedProfile);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  function handleEditClick() {
    const confirmEdit = window.confirm(
      "Do you want to edit your profile details?"
    );

    if (confirmEdit) {
      setTempProfile(profile);
      setIsEditing(true);
    }
  }

  function cancelEdit() {
    setTempProfile(profile);
    setIsEditing(false);
  }

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: tempProfile.full_name,
        phone: tempProfile.phone,
        role: tempProfile.role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated successfully!");

    setProfile(tempProfile);
    setIsEditing(false);
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">👤 My Profile</h1>

        {/* EMAIL (always read-only) */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Email</label>
          <input
            value={userEmail}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100"
          />
        </div>

        {/* VIEW MODE */}
        {!isEditing && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{profile.full_name || "Not set"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{profile.phone || "Not set"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">
                {profile.role || "Not set"}
              </p>
            </div>

            {profile.updated_at && (
              <p className="text-xs text-gray-400 mt-4">
                Last updated: {new Date(profile.updated_at).toLocaleString()}
              </p>
            )}

            <button
              onClick={handleEditClick}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* EDIT MODE */}
        {isEditing && (
          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                value={tempProfile.full_name}
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    full_name: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Phone Number</label>
              <input
                value={tempProfile.phone}
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    phone: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Role</label>
              <select
                value={tempProfile.role}
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    role: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              >
                <option value="user">User</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold"
              >
                Save
              </button>

              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-300 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}