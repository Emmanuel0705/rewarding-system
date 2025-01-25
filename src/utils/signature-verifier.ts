// src/utils/signatureVerifier.ts
import crypto from "crypto";

export class SignatureVerifier {
  static verifyWebhookSignature(
    payload: string,
    secret: string,
    signature: string
  ): boolean {
    try {
      const hmac = crypto.createHmac("sha256", secret);
      const computedSignature = `sha256=${hmac.update(payload).digest("hex")}`;
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(computedSignature)
      );
    } catch (error) {
      console.error("Signature verification failed", error);
      return false;
    }
  }
}
