import BloodDonorForm from "@/components/BloodDonorForm";
import DonorList from "@/components/DonorList";

export default function DonorsPage() {
  return (
    <div className="max-w-6xl mx-auto p-10">
      <BloodDonorForm />
      <DonorList />
    </div>
  );
}