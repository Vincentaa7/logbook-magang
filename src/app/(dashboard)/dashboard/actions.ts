"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEntry(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const unit_divisi = formData.get("unit_divisi") as string;
  if (!unit_divisi?.trim()) throw new Error("Unit/Divisi tidak boleh kosong");

  const { error } = await supabase.from("logbook_kegiatan").insert({
    user_id: user.id,
    tanggal: formData.get("tanggal") as string,
    unit_divisi: unit_divisi.trim(),
    deskripsi: formData.get("deskripsi") as string,
    kendala_solusi: (formData.get("kendala_solusi") as string) || null,
    tools: formData.get("tools") as string,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function updateEntry(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const unit_divisi = formData.get("unit_divisi") as string;
  if (!unit_divisi?.trim()) throw new Error("Unit/Divisi tidak boleh kosong");

  const { error } = await supabase
    .from("logbook_kegiatan")
    .update({
      tanggal: formData.get("tanggal") as string,
      unit_divisi: unit_divisi.trim(),
      deskripsi: formData.get("deskripsi") as string,
      kendala_solusi: (formData.get("kendala_solusi") as string) || null,
      tools: formData.get("tools") as string,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteEntry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("logbook_kegiatan")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
