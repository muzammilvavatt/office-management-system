"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function uploadFileAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;

  if (!file) {
    return { error: "No file selected." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  
  try {
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(uniqueName, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      return { error: "Failed to upload file to cloud storage." };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(uniqueName);
    
    // Save to DB
    await prisma.file.create({
      data: {
        name: file.name,
        url: publicUrl,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadedById: session.user.id,
        taskId: taskId || null,
        projectId: projectId || null,
      }
    });

  } catch (error) {
    console.error(error);
    return { error: "Failed to upload file." };
  }

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/projects");
}
