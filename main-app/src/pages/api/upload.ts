import type { NextApiRequest, NextApiResponse } from "next";
import { ROFLReader } from "rofl-parser.js";

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

    const reader = new ROFLReader(buffer);
    const metadata = reader.getMetadata();

    return res.status(200).json({ metadata });
  } catch (err) {
    console.error("ROFL parsing error:", err);
    return res.status(500).json({ 
      error: "Failed to parse replay",
      details: err instanceof Error ? err.message : String(err)
    });
  }
}