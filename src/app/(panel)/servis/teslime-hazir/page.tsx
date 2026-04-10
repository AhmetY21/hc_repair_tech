import { redirect } from "next/navigation";

export default async function ReadyServicesPage() {
  redirect("/servis?view=ready");
}
