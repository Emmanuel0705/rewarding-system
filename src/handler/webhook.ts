import { Request, Response } from "express";
import { isPRMergedToMaster, processWalletFromPR } from "../utils/webhook";
import { WebhookPayload } from "../interface/webhook";
import { createTwitterPost } from "../utils/twitter";
import { sendToken } from "../utils/transfer";

const REWARDING_AMOUNT = 1000000;

export const handleWebhook = async (req: Request, res: Response) => {
  // Process the event
  const event = req.headers["x-github-event"];
  console.log(`Received event: ${event}`);
  res.status(200).send("Event received");

  const payload: WebhookPayload = req.body;

  // Process the event
  if (event === "pull_request") {
    const isMerged = isPRMergedToMaster(payload);
    if (isMerged) {
      const address = processWalletFromPR(payload.pull_request);
      let explorerUrl;
      if (address) {
        const { explorerLink } = await sendToken(address, REWARDING_AMOUNT);
        explorerUrl = explorerLink;
      }

      await createTwitterPost(payload, explorerUrl);
    }
  } else {
    console.log(`Unhandled event: ${event}`);
  }
};
