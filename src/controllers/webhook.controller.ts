import { RequestParser } from "../utils/request-parser";
import { WalletService } from "../services/webhook.service";
import { PullRequestWebhookPayload } from "../types/webhook.types";

export class WebhookController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  handleMergedPullRequest(payload: PullRequestWebhookPayload) {
    if (payload.action === "closed" && payload.pull_request.merged) {
      const walletAddress = RequestParser.extractWalletAddress(
        payload.pull_request.body
      );

      if (walletAddress) {
        this.walletService.processWalletAddress(walletAddress);
      }
    }
  }
}
