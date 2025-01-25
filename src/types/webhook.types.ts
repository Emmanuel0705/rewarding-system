export interface PullRequestWebhookPayload {
  action: string;
  pull_request: {
    body: string;
    number: number;
    state: string;
    merged: boolean;
  };
  repository: {
    full_name: string;
  };
}
