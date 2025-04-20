# Technical Implementation Notes for LI.FI Challenge

This document summarizes the key challenges, design decisions, and implementation details encountered during the LI.FI
technical assignment.

---

## Project Architecture Overview

This project is organized using a **feature-based modular architecture**, promoting separation of concerns and long-term
scalability.

```
flexer-igorms/
├── app/
│   ├── components/            # UI components grouped by domain (onchain, portfolio, wallets, etc.)
│   ├── fsm/                   # Lightweight FSM logic and types (external to React)
│   ├── hooks/                 # Custom React hooks (balances, tokens, FSM control, etc.)
│   ├── lib/                   # Low-level logic (e.g., sending transactions)
│   ├── providers/             # Client-only and third-party providers (e.g., Solana)
│   ├── utils/                 # Utility functions (balance formatting, addresses, etc.)
│   ├── layout.tsx            # App layout (Next.js App Router)
│   └── page.tsx              # Main app entry point
├── docs/                      # Technical documentation and architecture decisions
├── tests/                     # High-level test cases and global sanity checks
├── .env_sample                # Environment variable template
├── .husky/                    # Git hooks configuration (pre-commit linting)
└── public/                    # Static assets
```

This structure separates logic cleanly between UI, business logic, Web3 integrations, and state machines — making it
easy to scale, test, and debug independently.

---

## 1. Multi-Chain Wallet Integration (Task 1)

### Why Next.js?

- Aligned with LI.FI’s preferred stack (public examples)
- App Router (app/) offers strong conventions for modularity
- Built-in support for SSR and file-system routing

### Why MUI instead of Tailwind?

- I usually prefer Tailwind, I opted for **MUI** to match styling consistency with LI.FI repos
- It was also a fun opportunity to revisit MUI and leverage its responsive utilities, typography system, and dark theme
  capabilities

### Wallet Context / SSR Issues (Solana)

- **Problem**: Solana’s wallet adapter does not support being used in `layout.tsx` (runs on the server).
- **Fix**: Moved `SolanaProvider` to a client-only wrapper component. However, I still encountered the issue for a
  while. To isolate the problem, I created a separate test project where it worked correctly. Ultimately, I deleted the
  `pnpm-lock.yaml` and `node_modules` folder, reinstalled everything, and the issue was resolved. It was likely caused
  by a misstep during initial dependency setup.


- **References**:
    - https://solana.com/developers/cookbook/wallets/connect-wallet-react
    - https://solana.com/developers/guides/wallets/add-solana-wallet-adapter-to-nextjs

### Multiple Token Fetching / UI Rendering

- **Problem**: Thousands of token balance requests caused performance issues and unnecessary RPC errors.
- **Fix**:
    - Filtered token list to only include `POPULAR_TOKEN_SYMBOLS`
    - Optimized query key and `enabled` condition:
      ```ts
      enabled: Boolean(enabled && (evmAddress || solanaAddress) && Object.keys(tokensByChain).length > 0)
      ```

### Token Display Pagination

- **Problem**: Displaying 3K+ tokens at once cluttered the UI.
- **Fix**: Display only the first 5 tokens per chain by default. Added:
    - `Show More +10`
    - `Show All` button
    - Conditional rendering for expanded views

### EVM + Solana Wallet Simultaneity

- **Feature**: Allowed both EVM and Solana wallets to be connected simultaneously.
- **UI**: Each wallet managed independently with appropriate hooks.

---

## 2. Balance Calculation and FSM Flow (Task 2)

### EVM Transactions to Self Failing with `data`

- **Problem**: Sending `data` to your own address resulted in RPC errors.
- **Fix**: Replaced target address with the burn address:
  ```ts
  export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD'
  ```

### FSM Implementation

- FSM logic implemented outside React component tree.
- FSM states handled:
    - `IDLE`, `PREPARING`, `SIGNING`, `SUCCESS`, `ERROR`
- Transitions triggered via dispatched events and reducer
- **References**:
    - https://en.wikipedia.org/wiki/Finite-state_machine
    - https://davidkpiano.medium.com/you-dont-need-a-library-for-state-machines-7f368a42c187
    - https://www.youtube.com/watch?v=sNFMdLEVxFo

### UI Feedback (Status)

- Clear transaction states with icons:
    - Preparing inscription message
    - Please sign the transaction
    - Sending transaction
    - Waiting for confirmation
    - Inscription complete!
    - Transaction failed
- Explorer link shown on successful transaction

---

## 3. Solana Specific Issues

### SOL Balance Not Displaying

- **Problem**: Phantom wallet had SOL but displayed as `0` in UI.
- **Fix**:
    - Improved `TokenList.tsx` logic to match `symbol` + `chainId` precisely.
    - Used `formatUnits` for consistent formatting:
      ```ts
      parseFloat(formatUnits(match.amount, token.decimals))
      ```

---

## 4. Tests

- Unit tests written using **Vitest**
- Mocked:
    - `wagmi` (EVM `getAccount`)
    - `@solana/wallet-adapter-react`
    - LI.FI SDK methods (`getTokens`, `getTokenBalancesByChain`)
- FSM unit tested independently from UI

---

## 5. Linting & Dev Experience

### Husky + Lint-Staged

- ESLint runs on every commit to avoid broken or unformatted code
- Lint-staged ensures only staged files are checked
- Goal: enforce clean, consistent code — especially in collab scenarios

---

All requirements from the challenge have been implemented

