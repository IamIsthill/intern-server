import imagekit from "../imagekit.js";

export const uploadToImageKit = async (file) => {
  const buffer = file.buffer;
  const fileName = file.originalname;

  try {
    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: "uploads_folder",
    });

    console.log("ImageKit Upload Result:", result);

    if (result && result.url) {
      return result.url;
    } else {
      throw new Error("ImageKit upload failed");
    }
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    throw error;
  }
};
