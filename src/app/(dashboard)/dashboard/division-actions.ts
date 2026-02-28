"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createDivision(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nama divisi tidak boleh kosong");

  const { error } = await supabase.from("user_divisions").insert({
    user_id: user.id,
    name: trimmed,
  });

  if (error) {
    if (error.code === "23505") throw new Error("Divisi sudah ada");
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function deleteDivision(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("user_divisions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
