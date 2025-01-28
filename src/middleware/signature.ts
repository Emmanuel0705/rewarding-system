import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
const GITHUB_SECRET = process.env.GITHUB_SECRET || "ABCD123";

export const verifySignature = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const signature = req.headers["x-hub-signature-256"] as string;
  if (!signature) {
    console.error("No signature found in headers");
    return res.status(200).send("Event received");
  }

  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", GITHUB_SECRET);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  const isValidsignature = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );

  if (!isValidsignature) {
    console.error("Invalid signature");
    return res.status(401).send("Invalid signature");
  }
  next();
};
