import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import { handleWebhook } from "./webhook";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3020;

app.post("/webhook", handleWebhook);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
