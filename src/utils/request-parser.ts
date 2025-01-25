export class RequestParser {
  static extractWalletAddress(prBody: string): string | null {
    const walletRegex = /wallet[:\s]*([0-9a-zA-Z]+)/i;
    const match = prBody.match(walletRegex);
    return match ? match[1] : null;
  }
}
