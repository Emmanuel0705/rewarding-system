export interface WebhookPayload {
  action: string;
  pull_request: {
    number: number;
    body: string;
    merged: boolean;
    base: { ref: string };
    title: string;
    user: {
      login: string;
    };
  };
  repository: {
    full_name: string;
    owner: {
      login: string;
    };
  };
}
