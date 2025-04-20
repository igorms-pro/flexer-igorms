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

- Aligned with LI.FI’s preferred stack (used across many of their public examples)
- App Router (app/) offers strong conventions for modularity
- Built-in support for SSR and file-system routing

#### Downside: Hydration errors

Because this project relies heavily on client-only Web3 providers (e.g., wagmi, solana wallet adapter) and responsive UI
via MUI, hydration errors occurred multiple times during development. This happens when the HTML rendered on the server
differs from what React renders on the client.

Typical causes:

- Usage of `window`, `localStorage`, or wallet contexts during SSR
- Emotion-generated class names (used by MUI) differing slightly between SSR and client
- `useMediaQuery` or wallet states initializing differently on server

Fix: Wrapped affected sections with a `mounted` flag to defer rendering until after hydration:

```ts
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
```

This delayed rendering until after the client loaded, ensuring server and client HTML match.

### Why MUI instead of Tailwind?

- Although I usually prefer Tailwind, I opted for MUI to match styling consistency with LI.FI internal repos
- It was also a fun opportunity to revisit MUI and leverage its responsive utilities, typography system, and dark theme
  capabilities

### Wallet Context / SSR Issues (Solana)

- Problem: Solana’s wallet adapter does not support being used in `layout.tsx` (runs on the server).
- Fix: Moved `SolanaProvider` to a client-only wrapper component. However, I still encountered the issue for a while. To
  isolate the problem, I created a separate test project where it worked correctly. Ultimately, I deleted the
  `pnpm-lock.yaml` and `node_modules` folder, reinstalled everything, and the issue was resolved. It was likely caused
  by a misstep during initial dependency setup.
- References:
    - https://solana.com/developers/guides/wallets/add-solana-wallet-adapter-to-nextjs

### Multiple Token Fetching / UI Rendering

- Problem: Thousands of token balance requests caused performance issues and unnecessary RPC errors.
- Fix:
    - Filtered token list to only include `POPULAR_TOKEN_SYMBOLS`
    - Optimized query key and `enabled` condition:
      ```ts
      enabled: Boolean(enabled && (evmAddress || solanaAddress) && Object.keys(tokensByChain).length > 0)
      ```

### Token Display Pagination

- Problem: Displaying 50+ tokens at once cluttered the UI.
- Fix: Display only the first 5 tokens per chain by default. Added:
    - `Show More +15`
    - `Show All` button
    - Conditional rendering for expanded views

### EVM + Solana Wallet Simultaneity

- Feature: Allowed both EVM and Solana wallets to be connected simultaneously.
- UI: Each wallet managed independently with appropriate hooks.

---

## 2. Balance Calculation and FSM Flow (Task 2)

### EVM Transactions to Self Failing with `data`

- Problem: Sending `data` to your own address resulted in RPC errors.
- Fix: Replaced target address with the burn address:
  ```ts
  export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD'
  ```

### FSM Implementation

- FSM logic implemented outside React component tree.
- FSM states handled:
    - `IDLE`, `PREPARING`, `SIGNING`, `SUCCESS`, `ERROR`
- Transitions triggered via dispatched events and reducer
- References:
    - https://xstate.js.org/docs/guides/machines.html
    - https://davidkpiano.medium.com/you-dont-need-a-library-for-state-machines-7f368a42c187
    - https://www.youtube.com/watch?v=9a1Abd3G8Qo

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

- Problem: Phantom wallet had SOL but displayed as `0` in UI.
- Fix:
    - Improved `TokenList.tsx` logic to match `symbol` + `chainId` precisely.
    - Used `formatUnits` for consistent formatting:
      ```ts
      parseFloat(formatUnits(match.amount, token.decimals))
      ```

### Debugging

- Added conditional logs:
  ```ts
  if (token.symbol === 'SOL') console.log('[DEBUG SOLANA MATCH]', { token, match })
  ```

---

## 4. Tests

- Unit tests written using Vitest
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