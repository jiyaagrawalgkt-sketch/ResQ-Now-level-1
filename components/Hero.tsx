export default function Hero() {
  return (
    <section className="text-center py-20 bg-red-50">
      <h1 className="text-6xl font-bold text-red-600">
        Emergency Resource Connect
      </h1>

      <p className="mt-4 text-xl text-gray-600">
        Connecting people with emergency resources instantly.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <button className="bg-red-600 text-white px-6 py-3 rounded-lg">
          Request Help
        </button>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Become Volunteer
        </button>
      </div>
    </section>
  );
}