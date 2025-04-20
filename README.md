<div align="center">
  <br />


  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-LI.FI-black?style=for-the-badge&logoColor=white&color=purple" alt="lifi" />
  </div>

<h3><b>Flexers Wallet</b> — Multi-Chain Balance Tracker with On-Chain Inscription</h3>
</div>

## 💻 Overview

**Flexers Wallet** is a multi-chain wallet interface built with **Next.js** and **TypeScript**, enabling users to:

- Connect both EVM and Solana wallets.
- View balances across supported chains (ETH, SOL, etc.).
- Calculate the total USD value of all assets.
- Inscribe that value on-chain (EVM or SVM).

## ⚙️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS + MUI** for responsive UI
- **Wagmi** + **RainbowKit** for EVM wallet integration
- **Solana Wallet Adapter** for SVM wallet connection
- **@lifi/sdk** for token price and balances
- **React Query** for async data fetching

## 🌟 Features

- ✅ Connect EVM and Solana wallets
- ✅ Fetch token lists and prices via LI.FI SDK
- ✅ Display balances grouped by chain
- ✅ Compute USD snapshot and display detailed modal
- ✅ Sign and send a transaction to inscribe balance on-chain
- ✅ Render history of past Solana inscriptions
- ✅ Light error handling + FSM state transition for UX

## 🤺 Quick Start

### 1. Clone the repo

```bash
git clone git@github.com:igorms-pro/flexer-igorms.git
cd flexer-igorms
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create your environment file

Create a `.env.local` file based on the sample:

```bash
cp .env_sample .env.local
```

Update the value of:

```env
NEXT_PUBLIC_PRIVATE_KEY=your_private_key_for_display
```

- Mine is from Metamask

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Supported Chains

- Ethereum
- Solana
- Arbitrum, Polygon, Optimism, BSC, Base, etc.

(Limited to what LI.FI SDK and RPC providers support.)

## 🚀 Deployment

Deploy this project on [Vercel](https://vercel.com/new) or your platform of choice.

## 📄 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Wagmi Docs](https://wagmi.sh/)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [LI.FI SDK](https://docs.li.fi/)

---

LI.FI coding challenge.

