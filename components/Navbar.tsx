"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  setUser(user);
}

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const navLinks = [
    { href: "/request", label: " Request Help" },
    { href: "/offer", label: " Offer Help" },
    {href: "/resources", label: "Available Resources"},
    { href: "/volunteer", label: " Join Volunteers" },
    { href: "/requests", label: " Live Requests" },
    { href: "/map", label: " Emergency Map" },
    { href: "/directory", label: " Contacts" },
    { href: "/dashboard", label: " Dashboard" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-2xl text-red-600 tracking-tight"
        >
           ResQ-Now
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {user ? (
  <>

   {user?.email === "admin@gmail.com" && (
  <Link
    href="/admin"
    className="text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
  >
    Admin
  </Link>
)}

    <span>
      {user.email}
    </span>
              <span className="hidden md:block text-sm text-gray-500 max-w-[180px] truncate">
                {user.name}
              </span>

              <Link href="/profile">
                <button className="hidden md:block px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                  👤 Profile
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-5 h-0.5 bg-black mb-1"></div>
            <div className="w-5 h-0.5 bg-black mb-1"></div>
            <div className="w-5 h-0.5 bg-black"></div>
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-3 flex flex-col gap-2">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
            {user.email === "admin@gmail.com" && (
  <Link
    href="/admin"
    onClick={() => setMenuOpen(false)}
    className="px-3 py-2 rounded-lg hover:bg-red-50"
  >
    Admin
  </Link>
)}
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50"
              >
                👤 Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50"
              >
                Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}