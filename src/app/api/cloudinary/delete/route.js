import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return Response.json(
        { success: false, error: "Public ID is required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}