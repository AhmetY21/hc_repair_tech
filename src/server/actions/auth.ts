"use server";

import { redirect } from "next/navigation";

import { clearSession, login, persistSession } from "@/server/auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("kullaniciAdi") ?? "");
  const password = String(formData.get("sifre") ?? "");

  const valid = await login(username, password);

  if (!valid) {
    redirect("/giris?hata=1");
  }

  await persistSession(username);
  redirect("/ana-sayfa");
}

export async function logoutAction() {
  await clearSession();
  redirect("/giris");
}
