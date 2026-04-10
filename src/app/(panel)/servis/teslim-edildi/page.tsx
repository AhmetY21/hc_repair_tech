import { redirect } from "next/navigation";

export default async function DeliveredServicesPage() {
  redirect("/servis?view=delivered");
}
