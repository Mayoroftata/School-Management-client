import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { fill } from "@cloudinary/url-gen/actions/resize";


const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinary = cloudName ? new Cloudinary({ cloud: { cloudName } }) : null;

export function schoolImage(publicId, fallbackSrc, width = 1600, height = 1000) {
  if (!cloudinary || !publicId) {
    return fallbackSrc;
  }

  return cloudinary
    .image(publicId)
    .resize(fill().width(width).height(height))
    .delivery(quality("auto"))
    .delivery(format("auto"))
    .toURL();
}

// Add upload function
export async function uploadToCloudinary(file, folder = "student_documents") {
  if (!cloudName) {
    throw new Error("Cloudinary is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  return response.json();
}

// Add delete function
export async function deleteFromCloudinary(publicId) {
  // Note: Delete requires backend endpoint for security
  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error("Delete failed");
  }

  return response.json();
}