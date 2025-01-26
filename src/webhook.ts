import { Request, Response } from "express";
import {
  isPRMergedToMaster,
  processWalletFromPR,
  verifySignature,
} from "./utils/webhook";
import { WebhookPayload } from "./interface/webhook";

/**
 * Webhook handler
 */
export const handleWebhook = async (
  req: Request,
  res: Response
): Promise<any> => {
  const isValidSignature = verifySignature(req);
  if (!isValidSignature) {
    console.error("Invalid signature");
    return res.status(401).send("Invalid signature");
  }

  // Process the event
  const event = req.headers["x-github-event"];
  console.log(`Received event: ${event}`);
  // res.status(200).send("Event received");

  // console.log({ body: JSON.parse(req.body?.payload) });

  const payload: WebhookPayload = JSON.parse(req.body?.payload);
  // console.log(payload);

  if (event === "pull_request") {
    const action = payload?.action;
    const prTitle = payload?.pull_request?.title;
    const author = payload?.pull_request?.user;
    const body = payload?.pull_request?.body;

    const walletAddress = processWalletFromPR(prTitle, body);
    const isMerged = isPRMergedToMaster(payload);

    console.log(`Wallet address: ${walletAddress}`);
    console.log(`PR merged: ${isMerged}`);

    console.log(`PR ${action}: "${prTitle}" by ${author} - ${body}`);
    res.status(200).send("PR event handled");
  } else {
    console.log(`Unhandled event: ${event}`);
    res.status(200).send("Event received");
  }
};
