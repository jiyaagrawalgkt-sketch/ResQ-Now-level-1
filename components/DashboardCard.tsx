interface Props {
  title: string;
  count: number;
}

export default function DashboardCard({
  title,
  count,
}: Props) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="text-4xl font-bold mt-2">
        {count}
      </p>
    </div>
  );
}