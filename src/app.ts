import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleWebhook } from "./handler/webhook";
import { verifySignature } from "./middleware/signature";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3020;

app.post("/webhook", verifySignature, handleWebhook);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
