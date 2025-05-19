import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "300mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { base64, filename } = req.body;
    if (!base64 || !filename) {
      return res.status(400).json({ error: "Missing file data" });
    }

    const buffer = Buffer.from(base64, "base64");
    // const tmpDir = path.resolve(process.cwd(), "tmp");
    const tmpDir = '/tmp';
    await fs.mkdir(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `${uuidv4()}-${filename}`);
    await fs.writeFile(filePath, buffer);

    return res.status(200).json({ path: filePath });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
