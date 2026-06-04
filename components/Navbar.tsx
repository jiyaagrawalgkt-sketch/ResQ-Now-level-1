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
    setUser(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const navLinks = [
    { href: "/request", label: "Request Help" },
    { href: "/requests", label: "Volunteer Board" },
    { href: "/offer", label: "Offer Help" },
    { href: "/map", label: "Emergency Map" },
    { href: "/directory", label: "Emergency Contacts" },
    { href: "/dashboard", label: "Dashboard" },

  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">

        {/* Logo — clicking takes user home */}
        <Link
          href="/"
          className="font-bold text-xl text-red-600 tracking-tight shrink-0"
        >
           ResQ-Now
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:block text-sm text-gray-500 truncate max-w-[160px]">
                {user.email}
              </span>
              <Link href="/profile">
                <button className="hidden md:block text-sm px-3 py-2 border rounded-lg hover:bg-gray-50 transition">
                  Profile
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition shrink-0"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-gray-600" />
            <div className="w-5 h-0.5 bg-gray-600" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white px-5 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
            >
              👤 Profile
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}