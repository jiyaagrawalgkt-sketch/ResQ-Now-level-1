import Link from "next/link";

export default function HomePage() {
  const categories = [
    {
      emoji: "",
      title: "Blood Donation",
      description: "Find blood donors quickly during emergencies.",
      link: "/requests?category=blood",
      color: "bg-red-50 border-red-100 hover:border-red-300",
      badge: "bg-red-100 text-red-700",
    },
    {
      emoji: "",
      title: "Medicines",
      description: "Request or provide urgent medicines.",
      link: "/requests?category=medicine",
      color: "bg-blue-50 border-blue-100 hover:border-blue-300",
      badge: "bg-blue-100 text-blue-700",
    },
    {
      emoji: "",
      title: "Transport",
      description: "Emergency transport and ambulance support.",
      link: "/requests?category=transport",
      color: "bg-yellow-50 border-yellow-100 hover:border-yellow-300",
      badge: "bg-yellow-100 text-yellow-700",
    },
    {
      emoji: "",
      title: "Food Support",
      description: "Food assistance during disasters and crises.",
      link: "/requests?category=food",
      color: "bg-orange-50 border-orange-100 hover:border-orange-300",
      badge: "bg-orange-100 text-orange-700",
    },
    {
      emoji: "",
      title: "Shelter",
      description: "Temporary accommodation and safe shelters.",
      link: "/requests?category=shelter",
      color: "bg-green-50 border-green-100 hover:border-green-300",
      badge: "bg-green-100 text-green-700",
    },
    {
      emoji: "",
      title: "Volunteers",
      description: "Connect with people ready to help right now.",
      link: "/requests",
      color: "bg-purple-50 border-purple-100 hover:border-purple-300",
      badge: "bg-purple-100 text-purple-700",
    },
  ];

  const quickLinks = [
    { href: "/request", emoji: "", label: "Request Help", desc: "Submit an emergency request" },
    { href: "/offer", emoji: "", label: "Offer Help", desc: "Register as a resource provider" },
    { href: "/requests", emoji: "", label: "Emergency Requests", desc: "See all open requests" },
    { href: "/resources", emoji: "", label: "Available Resources", desc: "Guides & emergency info" },
    { href: "/directory", emoji: "", label: "Emergency Contacts", desc: "Hospitals, helplines & more" },
    { href: "/volunteer", emoji: "", label: "Become a Volunteer", desc: "Join our responder network" },
    { href: "/my-requests", emoji: "", label: "My Requests", desc: "Track your submitted requests" },
    { href: "/dashboard", emoji: "", label: "Dashboard", desc: "Your activity & stats" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white border-b">
        {/* decorative bg circles */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-red-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-50 rounded-full opacity-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold tracking-wide mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Emergency Response Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Help Reaches You
            <br />
            <span className="text-red-600">Faster.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            ResQNow connects people in crisis with blood donors, medicine,
            food, transport, shelter, and volunteers — in real time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/request">
              <button className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition shadow-lg shadow-red-200">
                 Request Emergency Help
              </button>
            </Link>
            <Link href="/offer">
              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold text-lg hover:border-red-300 hover:bg-red-50 transition">
                 Offer Your Help
              </button>
            </Link>
          </div>

          {/* Trust bar */}
          <p className="mt-8 text-sm text-gray-400">
            Trusted by volunteers across India &nbsp;·&nbsp; Free &nbsp;·&nbsp; No registration required to request help
          </p>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "150+", label: "Active Requests", color: "text-red-600" },
            { value: "58+", label: "Volunteers Online", color: "text-blue-600" },
            { value: "550+", label: "People Helped", color: "text-green-600" },
            { value: "190+", label: "Cities Covered", color: "text-purple-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm"
            >
              <p className={`text-4xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-gray-500 text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS (replaces hidden nav items) ── */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            What do you need?
          </h2>
          <p className="text-gray-500 mt-1">
            Jump directly to the right place.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-red-200 hover:shadow-md transition cursor-pointer h-full group">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition text-sm">
                  {item.label}
                </h3>
                <p className="mt-1 text-gray-400 text-xs leading-snug">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Emergency Resource Categories
          </h2>
          <p className="text-gray-500 mt-1">
            Find or provide help by type of need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {categories.map((item) => (
            <Link key={item.title} href={item.link}>
              <div
                className={`border rounded-2xl p-6 transition cursor-pointer h-full ${item.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{item.emoji}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${item.badge}`}
                  >
                    Browse →
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SOS BANNER ── */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="bg-red-600 rounded-3xl text-white px-10 py-14 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-500 rounded-full opacity-40" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-red-700 rounded-full opacity-30" />
          <div className="relative">
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Life-threatening situation?
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold">
               Trigger SOS Alert
            </h2>
            <p className="mt-4 text-red-100 max-w-xl mx-auto text-lg">
              Send a high-priority SOS that instantly notifies all available
              volunteers near you.
            </p>
            <Link href="/request">
              <button className="mt-8 px-10 py-4 bg-white text-red-600 font-extrabold rounded-2xl text-lg hover:bg-red-50 transition shadow-xl">
                Send SOS Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white border-t py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How ResQNow Works
            </h2>
            <p className="text-gray-500 mt-2">
              Three steps between a crisis and help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: "",
                title: "Submit a Request",
                desc: "Fill out a simple form with your location, category, and urgency. No account needed.",
              },
              {
                step: "02",
                icon: "",
                title: "Community Notified",
                desc: "Registered volunteers and resource providers in your area see the request instantly.",
              },
              {
                step: "03",
                icon: "",
                title: "Help Arrives",
                desc: "A volunteer accepts your request and coordinates directly with you to resolve it.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <span className="text-7xl font-black text-gray-50 absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none">
                  {item.step}
                </span>
                <div className="relative">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-gray-900 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white">
          Ready to make a difference?
        </h2>
        <p className="text-gray-400 mt-3 max-w-md mx-auto">
          Join hundreds of volunteers already helping people across India.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link href="/signup">
            <button className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition">
              Join as Volunteer
            </button>
          </Link>
          <Link href="/requests">
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition border border-white/20">
              Browse Open Requests
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}