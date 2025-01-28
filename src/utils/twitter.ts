import { TwitterApi } from "twitter-api-v2";
import { WebhookPayload } from "../interface/webhook";
const TOKEN_SYMBOL = process.env?.TOKEN_SYMBOL || "RST";

const REWARDING_AMOUNT = 1000000;

const getTwitterContent = (params: WebhookPayload, tokenExpLink?: string) => {
  const pr = params.pull_request;
  const repo = params.repository;
  const repoName = repo?.full_name ?? "unknown";
  const username = pr.user?.login ?? "unknown";
  const prNumber = pr.number ?? 0;
  const tokenAmount = REWARDING_AMOUNT;

  const githubMessage = `🚀 PR Approved! 
🔗 New feature added by @${username}
👉 https://github.com/${repoName}/pull/${prNumber}
  `;
  const tokenMessage = `👍  ${tokenAmount}${TOKEN_SYMBOL} token earned
👉 ${tokenExpLink} `;

  if (tokenExpLink) return `${githubMessage} \n${tokenMessage}`;

  return githubMessage;
};

export async function createTwitterPost(payload: WebhookPayload, expL: string) {
  const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY!,
    appSecret: process.env.TWITTER_APP_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });

  const postContent = getTwitterContent(payload, expL);

  try {
    const tweet = await twitterClient.v2.tweet(postContent);
    return {
      success: true,
      tweetId: tweet.data.id,
    };
  } catch (error) {
    console.error("Twitter post failed", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
