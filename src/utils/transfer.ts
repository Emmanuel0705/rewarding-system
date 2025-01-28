// src/utils/transfer.utils.ts
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { Cluster, clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

// Configuration constants
const SOL_ENV = (process.env?.SOL_ENV as Cluster) || "devnet";
const TOKEN_CA =
  process.env.TOKEN_CA || "AqsyzfaydJ9osyZyrF5x4xG8Y22Q3dxr6y1iA5gp6PuY";

interface TransferResult {
  success: boolean;
  error?: string;
  explorerLink?: string;
}

export async function sendToken(
  recipientAddress: string,
  amount: number
): Promise<TransferResult> {
  const connection = new Connection(clusterApiUrl(SOL_ENV), "confirmed");
  const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
  console.log(process.env.TWITTER_ACCESS_SECRET);
  console.log({ token: TOKEN_CA });

  const tokenMintAccount = new PublicKey(TOKEN_CA);
  const recipientPubkey = new PublicKey(recipientAddress);

  try {
    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      senderKeypair,
      tokenMintAccount,
      senderKeypair.publicKey
    );

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      senderKeypair,
      tokenMintAccount,
      recipientPubkey
    );

    //get token mint balance

    console.log(`SENDING ${amount} tokens to ${recipientAddress}`);

    const signature = await transfer(
      connection,
      senderKeypair,
      sourceTokenAccount.address,
      destinationTokenAccount.address,
      senderKeypair,
      amount
    );

    const explorerLink = getExplorerLink("transaction", signature, SOL_ENV);

    console.log(`Explorer link: ${explorerLink}`);

    return { success: true, explorerLink };
  } catch (error) {
    console.error("Transfer failed", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
