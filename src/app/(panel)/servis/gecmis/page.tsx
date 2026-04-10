import { redirect } from "next/navigation";

export default async function ServiceHistoryPage() {
  redirect("/servis?view=all");
}
