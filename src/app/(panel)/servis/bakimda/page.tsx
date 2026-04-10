import { redirect } from "next/navigation";

export default async function InProgressServicesPage() {
  redirect("/servis?view=inProgress");
}
