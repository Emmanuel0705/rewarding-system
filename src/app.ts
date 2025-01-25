import express, { Request, Response } from "express";
import { WebhookController } from "./controllers/webhook.controller";
import { SignatureVerifier } from "./utils/signature-verifier";

const app = express();
app.use(express.json());
const port = 3020;

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";
const webhookController = new WebhookController();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post(
  "/webhooks/approved-pull-requests",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const payload = JSON.stringify(req.body);
      const signature = req.get("X-Hub-Signature-256") || "";

      // Verify webhook signature
      const isValidSignature = SignatureVerifier.verifyWebhookSignature(
        payload,
        GITHUB_WEBHOOK_SECRET,
        signature
      );
      if (!isValidSignature) {
        return res.status(403).send("Invalid webhook signature");
      }

      // Process the webhook
      webhookController.handleMergedPullRequest(req.body);
      res.status(200).send("Webhook processed successfully");
    } catch (error) {
      console.error("Webhook processing error", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
