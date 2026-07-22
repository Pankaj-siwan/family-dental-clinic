export const CLOUDINARY_CLOUD_NAME = "mf70deuh";
export const CLOUDINARY_UPLOAD_PRESET = "family_dental_cases";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
};

export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not a valid image.`);
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`${file.name} is larger than 10 MB.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.error?.message || `Failed to upload ${file.name}.`
    );
  }

  return response.json();
}