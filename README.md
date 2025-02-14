# Open Source Contributor Rewards Bot...

## Overview

This project automatically rewards contributors to open source projects with tokens when their pull requests are merged to the master branch. It creates a seamless integration between GitHub, Solana blockchain, and Twitter to:

1. Monitor pull request activities via GitHub webhooks.
2. Send tokens to contributors' wallets when their PRs are merged
3. Announce the contributions and rewards on Twitter..

This creates a transparent and automated way to incentivize and recognize open source contributions..

## Features

- 🔄 Automatic monitoring of PR merges via GitHub webhooks
- 💎 Automated token transfers on Solana blockchain
- 🐦 Automated Twitter announcements for rewards
- ✅ Secure webhook signature verification
- 💫 Support for custom token amounts
- 🔐 Secure key management
- 📊 Transaction tracking via Solana Explorer

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Solana CLI tools
- GitHub account with admin access to the repository
- Twitter Developer Account
- Access to Solana wallet/keypair

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Emmanuel0705/rewarding-system
cd rewarding-system
npm install
```

2. Configure environment variables:

```bash
cp example.env .env
```

Update the `.env` file with your credentials:

```env
# Solana Configuration
SOL_ENV=devnet
SECRET_KEY=your_solana_secret_key
TOKEN_CA=your_token_contract_address
TOKEN_NAME=your_token_name
TOKEN_SYMBOL=your_token_name
TOKEN_DECIMALS=9
TOKEN_URI=your_token_metadata_uri

# GitHub Configuration
GITHUB_SECRET=your_webhook_secret

# Twitter Configuration
TWITTER_APP_KEY=your_twitter_api_key
TWITTER_APP_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_token_secret
```

3. Create a Solana keypair (if you don't have one):

```bash
npm run create-keypair
```

This will generate a new keypair and output the secret key. Update your `.env` file with this key.

4. Create a Solana token (optional):

```bash
npm run create-token
```

This will create a new token on the Solana blockchain. Update your `.env` file with the token address.

5. Set up Twitter API credentials:

- Create a Twitter Developer account at https://developer.twitter.com
- Create a new app and generate API keys
- Update your `.env` file with the Twitter credentials

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## GitHub Webhook Setup

1. Go to your GitHub repository settings
2. Navigate to Webhooks > Add webhook
3. Set Payload URL to your server URL (e.g., `https://your-domain.com/webhook`)
4. Set Content type to `application/json`
5. Set Secret to the same value as your `GITHUB_WEBHOOK_SECRET`
6. Select "Pull request" events only
7. Enable SSL verification if using HTTPS

## Important Notes

- This bot only processes pull requests that are merged to the master branch
- Contributors must include their Solana wallet address in their PR title or body using the format: <your-sol-wallet-address-here>
- The bot verifies webhook signatures for security
- All transactions are performed on the network specified in `SOL_ENV`
- Failed transactions are logged but do not stop the webhook processing

## How It Works

1. When a PR is merged to master:

   - Webhook receives the GitHub event
   - Bot verifies the webhook signature
   - Bot extracts the contributor's wallet address from PR description
     Example PR format:
     Title or Body: Fixed navigation bug <AF3sD9...y5K2P>
   - Bot initiates token transfer to the contributor
   - Bot creates a Twitter post announcing the contribution

2. The Twitter post includes:
   - Contributor's GitHub username
   - Repository name
   - PR number
   - Token amount
   - Transaction link on Solana Explorer

## Troubleshooting

- **Webhook not working**: Verify your webhook secret and server URL
- **Token transfer failing**: Check your Solana wallet balance and network status
- **Twitter posts not appearing**: Verify your Twitter API credentials
- **Invalid signatures**: Ensure your webhook secret matches in GitHub and `.env`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security

Please do not commit your `.env` file or expose your private keys. The `.env` file is included in `.gitignore` for your protection.
