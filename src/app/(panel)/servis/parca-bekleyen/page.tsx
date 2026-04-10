import { redirect } from "next/navigation";

export default async function WaitingPartServicesPage() {
  redirect("/servis?view=waitingParts");
}
