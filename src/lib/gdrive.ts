import { google } from "googleapis";
import { Readable } from "stream";

// Initialize Google Auth
const getGoogleAuth = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // Replace actual literal \n strings with newline characters if they are escaped in env
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google Drive credentials in environment variables.");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
};

/**
 * Uploads a file buffer to the specific Google Drive folder.
 * Returns the public direct-download/view URL.
 */
export async function uploadToGDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const auth = getGoogleAuth();
  const drive = google.drive({ version: "v3", auth });
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error("Missing GOOGLE_DRIVE_FOLDER_ID in environment variables.");
  }

  // Convert buffer to stream for Google Drive API
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  try {
    // 1. Create the file in the specific folder
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };
    
    const media = {
      mimeType,
      body: stream,
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = res.data.id;
    if (!fileId) throw new Error("File ID not returned from Google Drive.");

    // 2. Set permissions to anyone with the link
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // 3. Return the direct view/download URL
    // uc?id=... is used to render/download files directly bypassing the Drive preview UI
    return `https://drive.google.com/uc?id=${fileId}`;

  } catch (error: any) {
    console.error("Google Drive Upload Error:", error);
    throw new Error(`Failed to upload to Google Drive: ${error.message}`);
  }
}

/**
 * Deletes a file from Google Drive using its public URL.
 */
export async function deleteFromGDrive(publicUrl: string): Promise<void> {
  if (!publicUrl.includes("drive.google.com/uc?id=")) {
    return; // Not a GDrive URL
  }

  try {
    const fileId = new URL(publicUrl).searchParams.get("id");
    if (!fileId) return;

    const auth = getGoogleAuth();
    const drive = google.drive({ version: "v3", auth });

    await drive.files.delete({
      fileId: fileId,
    });
  } catch (error) {
    console.error("Google Drive Delete Error:", error);
    // Non-fatal, just log it.
  }
}
