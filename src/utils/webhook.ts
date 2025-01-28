import { WebhookPayload } from "../interface/webhook";

export function extractSolanaWallet(
  title: string,
  body: string
): string | null {
  const solanaWalletPattern = /<([\w]{32,44})>/;

  const titleMatch = title.match(solanaWalletPattern);
  if (titleMatch) return titleMatch[1];

  const bodyMatch = body.match(solanaWalletPattern);
  return bodyMatch ? bodyMatch[1] : null;
}

export function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

export function processWalletFromPR(
  pr: WebhookPayload["pull_request"]
): string | null {
  const address = extractSolanaWallet(pr.title, pr.body);
  return address && isValidSolanaAddress(address) ? address : null;
}

export function isPRMergedToMaster(payload: WebhookPayload): boolean {
  return (
    payload.action === "closed" &&
    payload.pull_request.merged &&
    payload.pull_request.base.ref === "master"
  );
}
