import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  filePath: string,
  folder: string,
  resourceType: "image" | "raw"
) => {
  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
  });
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "raw"
) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
