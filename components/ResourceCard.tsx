interface Props {
  title: string;
  description: string;
}

export default function ResourceCard({
  title,
  description,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold">{title}</h2>

      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </div>
  );
}