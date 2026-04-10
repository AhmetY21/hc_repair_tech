import { redirect } from "next/navigation";

export default async function IncomingServicesPage() {
  redirect("/servis?view=incoming");
}
