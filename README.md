# HotDog Name Service UI (HNS‑UI)

## Overview

This project is a **Next.js** interface for interacting with **HotDog Name Service (HNS)** contracts on the **Abstract** blockchain.

Currently deployed [here](https://hotdogs.humblefool13.dev)

It lets users:

- Search, resolve, and inspect HNS domains (e.g. `sausage.hotdogs`)
- Register and renew domains for multiple years
- Transfer domains using either **wallet addresses** or **domain names**
- Manage owned domains and set a **main domain**
- Browse a global activity feed of registrations, renewals, transfers, and expirations

The app is optimized for a smooth, animated UX with light/dark themes and wallet integration via the Abstract stack.

---

## Features

- **Search & Resolve**
  - Search domains like `name.tld`
  - Check availability and on‑chain data (owner, expiration, NFT metadata)
  - Deep links to:
    - Abscan (or configured explorer)
    - OpenSea
    - Magic Eden
    - Mintify

- **Register & Renew**
  - Register available domains for **1–10 years**
  - Pricing logic based on domain length (3+ chars, etc.)
  - Renew domains with an **estimated cost** preview in ETH

- **Manage Names**
  - View all domains owned by the connected wallet
  - Mark one domain as the **Main Domain**
  - See status badges: **Active** / **Expiring Soon**
  - **Transfer** domains using:
    - A direct wallet address (`0x...`), or
    - A domain name (`name.tld`), which is resolved to an address
  - Strong validation and error messages for:
    - Invalid addresses/domains
    - Non‑existent or expired domains
    - Reverted / rejected transactions

- **Activity Feed**
  - Global list of events across all TLDs:
    - `register`, `renew`, `transfer`, `expire`
  - Fetches logs via the `/api/ns/getLogs` endpoint per TLD
  - Where possible, replaces raw addresses with the owner’s **main domain**

- **Docs & Guides**
  - In‑app **Guide** explaining how HNS works
  - **Docs** tab with developer‑oriented examples for contract reads/writes

- **UI / UX**
  - Responsive layout using **Tailwind CSS**
  - Rich animations via **Framer Motion**
  - **Light/Dark** theme toggle
  - Sidebar `Navbar` with summary stats (main domain, total owned, expiring soon)

---

## Tech Stack

- **Framework**: Next.js (App Router, TypeScript, React 18)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: `lucide-react`
- **Web3 / Contracts**:
  - [`viem`](https://viem.sh/) for contract interactions
  - [`wagmi`](https://wagmi.sh/) for account and network state
  - [`@abstract-foundation/agw-react`](https://github.com/Abstract-Foundation) for wallet & Abstract client
- **Contracts**:
  - `HNSManager` – registry for TLDs and global helper functions
  - `NameService` – per‑TLD contracts implementing registration, renewal, transfer, etc.

---

## Getting Started

### 1. Prerequisites

- **Node.js** `>= 18`
- Package manager: **pnpm** (recommended), **yarn**, or **npm**
- Deployed HNS contracts on an **Abstract** network:
  - `HNSManager` contract address
  - One or more `NameService` contracts registered in `HNSManager`
  - An explorer domain (e.g. `abscan.io`)

> If you’re running on a specific Abstract testnet/mainnet, update the values in `.env.local` accordingly.

### 2. Install Dependencies

From the project root:

```bash
# with pnpm
pnpm install

# or with yarn
yarn install

# or with npm
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# HNS Manager contract address (Abstract network)
NEXT_PUBLIC_CA=0xYourHNSManagerAddressHere

# Explorer base domain (NO protocol). Used for tx and NFT links:
# e.g. abscan.io  or testnet.abscan.io
NEXT_PUBLIC_EXPLORER=abscan.io

# RPC URL
ABSTRACT_RPC_URL=yourRpcUrl


```

### 4. Run in Development

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 5. Build for Production

```bash
pnpm build
pnpm start

# or using yarn / npm equivalents
```

Deploy the built Next.js app to your preferred platform (Vercel, Docker, etc.).

---

## Project Structure (Key Files)

Only the most relevant files are listed here:

- `src/app/page.tsx`
  - Root page; manages the main layout and which section is active:
    - Search
    - Manage
    - Activity
    - Guide
    - Docs

- `src/components/Navbar.tsx`
  - Floating sidebar with:
    - App logo & theme toggle
    - Navigation links (Search, Manage, Activity, Guide, Docs)
    - “My Names” summary:
      - Main Domain (or wallet address if none)
      - Total domains owned
      - Number expiring soon
  - Listens for a custom `mainDomainChanged` event to refresh state after the main domain is updated from `ManagePage`.

- `src/components/SearchSection.tsx`
  - Domain search + availability:
    - Uses `/api/hns/tlds` to load supported TLDs
    - Uses `/api/hns/resolve` (`resolveDomainRPC`) to resolve names without needing a wallet
  - Registration flow:
    - Validates input (`name.tld`, length, characters)
    - Shows pricing via `getDomainPrice`
    - Calls `registerDomain(name, tld, years)` from `ContractContext`
    - Polls `resolveDomainRPC` after the tx to update the UI when the domain becomes registered

- `src/components/ManagePage.tsx`
  - Loads all domains owned by the connected `address` via `getAddressDomains`
  - For each domain, fetches expiration via `getDomainExpiration`
  - Shows:
    - Domain name
    - Expiration date
    - Status badge: Active / Expiring Soon
  - Actions:
    - **Set Main Domain** – calls `setMainDomain`, reloads data, and emits `mainDomainChanged`
    - **Transfer Domain** – uses:
      - Plain address (`0x...`), or
      - Domain name (`name.tld`) resolved via `resolveDomain` to an owner address
      - With strong validation + error messages for invalid/expired/non‑existent domains
    - **Renew Domain** – calculates cost via `getDomainPrice` and calls `renewDomain`

- `src/components/ActivityPage.tsx`
  - On mount:
    - Fetches all registered TLDs via `getRegisteredTLDsRPC`
    - For each TLD, calls `/api/ns/getLogs` with the NameService contract address
  - Normalizes events into a unified `EventItem` list and sorts by `timestamp`
  - Uses `getMainDomain` to show human‑readable names in place of bare addresses when possible.

- `src/contexts/ContractContext.tsx`
  - Centralized contract setup + API surface for the app:
    - **Instances**
      - `hnsManagerContract`
      - `nameServiceContracts` map (`Map<tld, contract>`)
    - **Reads**
      - `getRegisteredTLDs`, `getRegisteredTLDsRPC`
      - `resolveDomain`, `resolveDomainRPC`
      - `reverseLookup(address)`
      - `getAddressDomains(address)`
      - `getMainDomain(address)`
      - `getDomainExpiration(name, tld)`
    - **Writes**
      - `setMainDomain(domain)`
      - `registerDomain(name, tld, years)`
      - `renewDomain(name, tld, years)`
      - `transferDomain(name, tld, to)`
    - **Utilities**
      - `getNameServiceContract(tld)`
      - `getDomainPrice(name, years)`
      - Connection state: `isConnected`, `address`

- `src/app/api/hns/*`
  - **`/api/hns/tlds`** – serverless route to list registered TLDs via a public client
  - **`/api/hns/resolve`** – resolve `name.tld` without requiring a wallet
  - **`/api/ns/getLogs`** – fetch and normalize event logs (register/renew/transfer/expire) per NameService contract

- `src/contracts/HNSManager.json`, `src/contracts/NameService.json`
  - ABIs used by `viem` to interact with the contracts.

---

## Core Flows

### Search & Registration

1. User types a name (with or without TLD) into the search bar.
2. Client normalizes/validates input and infers a default TLD if omitted.
3. Calls `resolveDomainRPC(name, tld)`:
   - If **registered & active**:
     - Shows owner, expiration, and NFT links.
   - If **not registered**:
     - Shows availability and estimated price (`getDomainPrice`).
4. On **Register**:
   - Sends a transaction via `registerDomain(name, tld, years)`.
   - Polls `resolveDomainRPC` until the domain is confirmed as registered.

### Manage & Transfer

1. `ManagePage` loads the user’s domains and expiration timestamps.
2. User can:
   - **Set Main Domain** – updates on‑chain and refreshes both Manage & Navbar.
   - **Transfer**:
     - Enter `0x...` or `name.tld`.
     - If a domain is given, the app:
       - Resolves it via `resolveDomain`
       - Ensures it exists, is not expired, and has a valid `owner`
       - Uses the resolved address as `to`.
3. After a successful transfer/renew:
   - The list refreshes automatically.
   - Modals close and buttons show loading/disabled states while the tx is pending.

### Activity

1. `ActivityPage` fetches logs for every `NameService` contract via `/api/ns/getLogs`.
2. Builds a sorted timeline of:
   - Domain registration
   - Renewals
   - Transfers
   - Expirations
3. Where possible, calls `getMainDomain(address)` to render human‑readable names in place of raw addresses.

---

## Development & Contribution

- Make sure your `.env.local` is configured for the correct Abstract network and deployed HNS contracts.
- Run `pnpm dev` (or `yarn dev` / `npm run dev`) during development.
- Before pushing:
  - Run `pnpm lint` (if configured) and ensure there are no TypeScript or linter errors.

If you’d like, you can extend this UI with:

- Reverse lookup tools (address → primary domain search)
- Per‑address dashboards
- Advanced filters in the Activity view
- Additional networks or contract versions

---
