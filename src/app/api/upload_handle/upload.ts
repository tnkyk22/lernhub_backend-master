import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export async function upload(file: File) {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");

    const allowedFileTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedFileTypes.includes(file.type)) {
      throw new Error("Only .pdf, .png, and .jpg files are allowed.");
    }

    const extension = path.extname(file.name);
    const fileName = `${Date.now()}-${nanoid()}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return { filePath, fileName };
  } catch (error) {
    throw new Error(`Failed to upload file: ${error}`);
  }
}

export async function UploadThumbnail(file: File) {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");

    const allowedFileTypes = ["image/png", "image/jpeg"];
    if (!allowedFileTypes.includes(file.type)) {
      throw new Error("Only .png and .jpg files are allowed.");
    }

    const extension = path.extname(file.name);
    const fileName = `${Date.now()}-${nanoid()}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return { filePath, fileName };
  } catch (error) {
    throw new Error(`Failed to upload file: ${error}`);
  }
}
