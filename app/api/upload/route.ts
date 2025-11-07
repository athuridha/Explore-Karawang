import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: "Invalid file type. Only images allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { success: false, error: "File too large. Max size is 5MB." },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const ext = file.name.split(".").pop()
    const filename = `${timestamp}-${random}.${ext}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(UPLOAD_DIR, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${filename}`

    return Response.json({
      success: true,
      data: {
        url: publicUrl,
        filename: filename,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
