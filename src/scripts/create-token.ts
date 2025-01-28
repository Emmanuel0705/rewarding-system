import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import dotenv from "dotenv";
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";
import {
  Cluster,
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
const metadataProgramId = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
dotenv.config();

async function createToken() {
  const SOL_ENV = (process.env?.SOL_ENV as Cluster) || "devnet";
  const TOKEN_NAME = process.env.TOKEN_NAME || "Rewarding System Token";
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "RST";
  const TOKEN_DECIMALS = process.env.TOKEN_DECIMALS || 9;
  const TOKEN_URI = process.env.TOKEN_URI || "https://arweave.net/1234";
  const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 9);

  const connection = new Connection(clusterApiUrl(SOL_ENV), "confirmed");

  const user = getKeypairFromEnvironment("SECRET_KEY");

  console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
  );

  const tokenMint = await createMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    Number(TOKEN_DECIMALS)
  );

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(metadataProgramId);

  const metadataData = {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    uri: TOKEN_URI,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBytes(),
      tokenMint.toBytes(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const metadataPDA = metadataPDAAndBump[0];

  const transaction = new Transaction();

  const createMetadataAccountInstruction =
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: tokenMint,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          collectionDetails: null,
          data: metadataData,
          isMutable: true,
        },
      }
    );

  transaction.add(createMetadataAccountInstruction);

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );

  const transactionLink = getExplorerLink(
    "transaction",
    transactionSignature,
    SOL_ENV
  );

  console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}`);

  const tokenMintLink = getExplorerLink(
    "address",
    tokenMint.toString(),
    SOL_ENV
  );

  console.log(`✅ Look at the token mint again: ${tokenMintLink}`);

  //

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMint,
    user.publicKey
  );

  const mintSignature = await mintTo(
    connection,
    user,
    tokenMint,
    tokenAccount.address,
    user,
    10 * MINOR_UNITS_PER_MAJOR_UNITS
  );

  const link = getExplorerLink("transaction", mintSignature, SOL_ENV);

  console.log(`✅ Success! Mint Token Transaction: ${link}`);
}

createToken();
