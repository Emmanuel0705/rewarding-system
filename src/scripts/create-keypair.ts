import { Keypair } from "@solana/web3.js";

async function createKeypair() {
  const wallet = Keypair.generate();
  const publicKey = wallet.publicKey.toBase58();
  const secretKey = wallet.secretKey;
  console.log("Public key:", publicKey);
  console.log("Secret key:", secretKey);
}

createKeypair();
