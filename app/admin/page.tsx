import DashboardCard from "@/components/DashboardCard";

export default function AdminPage() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <DashboardCard
          title="Total Users"
          count={0}
        />

        <DashboardCard
          title="Blood Donors"
          count={0}
        />

        <DashboardCard
          title="Vehicles"
          count={0}
        />

        <DashboardCard
          title="Food Providers"
          count={0}
        />

        <DashboardCard
          title="Shelters"
          count={0}
        />

        <DashboardCard
          title="Emergency Requests"
          count={0}
        />

      </div>
    </div>
  );
}