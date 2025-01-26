import { Request } from "express";
import { WebhookPayload } from "../interface/webhook";
import crypto from "crypto";
const GITHUB_SECRET = process.env.GITHUB_SECRET || "random";

/**
 * Verify the webhook signature
 * @param req - Express request object
 * @returns boolean - True if the signature is valid
 */
export function verifySignature(req: Request): boolean {
  const signature = req.headers["x-hub-signature-256"] as string;
  if (!signature) {
    console.error("No signature found in headers");
    return false;
  }

  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", GITHUB_SECRET);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  console.log(`Signature: ${signature}`);
  console.log(`Digest: ${digest}`);

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export function extractWalletAddress(text: string): string | null {
  const pattern = /<(0x[0-9a-fA-F]+)>/;
  const match = text.match(pattern);
  return match ? match[1] : null;
}

export function processWalletFromPR(
  title: string,
  body: string
): string | null {
  return extractWalletAddress(title) || extractWalletAddress(body);
}

export function isPRMergedToMaster(payload: WebhookPayload): boolean {
  return (
    payload.action === "closed" &&
    payload.pull_request.merged &&
    payload.pull_request.base.ref === "master"
  );
}
