import Link from "next/link";

import {
  FaHeart,
  FaMapMarkerAlt,
  FaHandsHelping,
  FaPhoneAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">

      {/* Feedback Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center">

          <Link
            href="/review"
            className="inline-block bg-red-600 hover:bg-red-700 transition px-10 py-4 rounded-xl text-2xl font-bold shadow-lg"
          >
             Share Your Feedback 
          </Link>

          <p className="text-gray-300 mt-5 text-lg">
            Your feedback helps us improve ResQ-Now and serve the community better.
          </p>

          <p className="text-gray-400">
            Share your experience, suggestions, or ideas to make emergency
            support more effective.
          </p>

        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-8 py-10 grid md:grid-cols-4 gap-10">

        {/* About */}
        <div>

          <h2 className="text-3xl font-bold text-red-500 flex items-center gap-2 mb-4">
             ResQ-Now
          </h2>

          <div className="space-y-3 text-gray-300">

            <p className="flex items-center gap-2">
              <FaMapMarkerAlt />
              Bhopal, India
            </p>

            <p className="flex items-center gap-2">
              <FaHandsHelping />
              Community Driven Platform
            </p>

            <p className="flex items-center gap-2">
              <FaPhoneAlt />
              24×7 Emergency Support
            </p>

          </div>

        </div>

        {/* Quick Links */}
        <div>

          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>

          <div className="flex flex-col gap-2 text-gray-300">

            <Link href="/request">Request Help</Link>

            <Link href="/offer">Offer Help</Link>

            <Link href="/resources">Resources</Link>

            <Link href="/dashboard">Dashboard</Link>

          </div>

        </div>

        {/* Emergency Services */}
        <div>

          <h3 className="text-xl font-semibold mb-4">
            Emergency Services
          </h3>

          <div className="flex flex-col gap-2 text-gray-300">

            <Link href="/map">Emergency Map</Link>

            <Link href="/directory">Emergency Contacts</Link>

            <Link href="/volunteer">Join Volunteers</Link>

            <Link href="/requests">Live Requests</Link>

          </div>

        </div>

        {/* Community */}
        <div>

          <h3 className="text-xl font-semibold mb-4">
            Community
          </h3>

          <div className="flex flex-col gap-4">

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-blue-500 transition"
            >
              <FaFacebook size={22} />
              Facebook
            </a>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-pink-500 transition"
            >
              <FaInstagram size={22} />
              Instagram
            </a>

            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <FaLinkedin size={22} />
              LinkedIn
            </a>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}

      <div className="border-t border-gray-700">

        <div className="max-w-7xl mx-auto px-8 py-6 text-center">

          <p className="text-gray-300 text-lg">
            © 2026 ResQ-Now | Together We Save Lives
          </p>

          <p className="text-gray-500 mt-3">
            Designed & Developed by
          </p>

          <p className="text-red-500 text-2xl font-bold mt-1">
            Sahyog
          </p>

        </div>

      </div>

    </footer>
  );
}