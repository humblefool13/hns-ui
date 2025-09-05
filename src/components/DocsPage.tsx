"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Code,
  Link,
  RefreshCw,
  Clipboard,
  Check,
} from "lucide-react";
import { HNS_MANAGER_ADDRESS } from "../contexts/ContractContext";
import { useState } from "react";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (_err) {
      // ignore
    }
  }

  return (
    <div className="group relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <button
        aria-label={copied ? "Copied" : "Copy"}
        onClick={onCopy}
        disabled={copied}
        className="absolute right-3 top-3 inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-100/50 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-900 dark:text-gray-300 transition opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600 hover:cursor-not-allowed" />
        ) : (
          <Clipboard className="h-4 w-4 text-gray-700 dark:text-gray-300 hover:cursor-pointer" />
        )}
      </button>
      <pre className="text-xs whitespace-pre-wrap break-words overflow-x-auto text-gray-800 dark:text-gray-200">
        {code}
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen p-6 md:ml-96 md:mr-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="glass-card p-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            HNS Developer Documentation
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Integrate HotDogs Name Service (HNS) into your dapp. This guide
            covers architecture, contracts, and production-ready code examples
            for resolving names, reverse lookups, registering, renewing,
            transfers, and working with per-TLD name service contracts.
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300 glass-card">
          <div className="flex items-center gap-3">
            <FileText className="text-green-500" />
            <h2 className="text-2xl font-semibold text-foreground">
              Architecture Overview
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            HNS uses a manager-based architecture. A single manager contract
            maintains the registry of top-level domains (TLDs) and
            deploys/records a dedicated NameService contract for each TLD.
            Public dapps interact with public functions only; any restricted
            admin flows are intentionally excluded here.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Naming Rules
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <strong>TLDs:</strong> 3-10 characters, letters only (no numbers
                or special characters), lowercase only.
              </div>
              <div>
                <strong>Names:</strong> 3-10 characters, letters, numbers, and
                hyphens allowed. No consecutive hyphens, no hyphens at beginning
                or end, lowercase only.
              </div>
            </div>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{`Manager (HNSManager)
  ├─ Tracks registered TLDs: ["rise", "hotdogs", ...]
  ├─ Maps TLD -> NameService contract address
  ├─ Provides global read helpers: resolve(name, tld), reverseLookup(address), etc.
  └─ Public reads only in this guide; admin writes are not documented here.

NameService (per TLD)
  ├─ Owns registration data for that TLD
  ├─ Public flows: register(name, years), renew(name, years), transferDomain(name, to)
  └─ Reads: getDomainExpiration(name) and ABI-specific helpers`}</pre>
          <CodeBlock
            code={`// Deployed manager address\nconst HNS_MANAGER_ADDRESS = "${HNS_MANAGER_ADDRESS}"`}
          />
        </div>

        {/* Node.js RPC Setup */}
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300 glass-card">
          <div className="flex items-center gap-3">
            <Code className="text-blue-500" />
            <h2 className="text-2xl font-semibold text-foreground">
              Node.js RPC setup + Basic Examples
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Use viem to read/write directly against the contracts from a Node.js
            script. For authenticated writes, you can use an AGW client (see
            <a
              className="mx-1 underline"
              href="https://docs.abs.xyz/abstract-global-wallet/getting-started"
              target="_blank"
              rel="noreferrer"
            >
              AGW Getting Started
            </a>
            ), or for simple reads create a public client using your RPC.
          </p>
          <CodeBlock
            code={`// Public client setup (reads)
import { createPublicClient, http, getContract } from "viem";
import HNSManagerABI from "@/src/contracts/HNSManager.json";
import NameServiceABI from "@/src/contracts/NameService.json";
const HNS_MANAGER_ADDRESS = "${HNS_MANAGER_ADDRESS}"

const RPC_URL = process.env.RPC_URL!; // set your network RPC URL
const CHAIN = abstract; // optionally pass a viem chain config if available

const publicClient = createPublicClient({ transport: http(RPC_URL), chain: CHAIN });

// Create the manager contract instance
const manager = getContract({
  address: HNS_MANAGER_ADDRESS,
  abi: (HNSManagerABI as any).abi,
  client: publicClient,
});`}
          />
        </div>

        {/* Core Reads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border glass-card border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <Link className="text-blue-500" />
              <h3 className="text-xl font-semibold text-foreground">
                Resolve name → on-chain record
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Resolve a domain to its owner, expiration, and NFT metadata via
              the manager.
            </p>
            <CodeBlock
              code={`// Node.js viem read\nconst [owner, expiration, nftAddress, tokenId] = await manager.read.resolve([\n  "alice", // name\n  "hotdogs", // tld\n]);\nconsole.log({ owner, expiration: Number(expiration), nftAddress, tokenId: Number(tokenId) });`}
            />
          </div>

          <div className="p-6 border glass-card border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <RefreshCw className="text-purple-500" />
              <h3 className="text-xl font-semibold text-foreground">
                Reverse: address → primary name
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Get the primary name assigned to a wallet address.
            </p>
            <CodeBlock
              code={`// Node.js viem read\nconst primaryName = await manager.read.reverseLookup([\n  "0x1234567890abcdef1234567890abcdef12345678",\n]);\nconsole.log(primaryName);`}
            />
          </div>
        </div>

        {/* TLD discovery and NameService access */}
        <div className="glass-card p-6 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
          <div className="flex items-center gap-3">
            <FileText className="text-green-500" />
            <h2 className="text-2xl font-semibold text-foreground">
              TLD discovery and NameService access
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            The manager enumerates registered TLDs and returns the NameService
            contract address for each. The context caches discovered contracts
            for reuse.
          </p>
          <CodeBlock
            code={`// Read available TLDs\nlet tlds: string[] = [];\nlet index = 0;\nwhile (true) {\n  try {\n    const tld = await manager.read.registeredTLDs([BigInt(i)]);\n    if (!tld) break;\n    tlds.push(tld);\n  } catch {\n    break;\n  }\n}\nconsole.log(tlds); // ["hotdogs", "rise", ...]\n\n// Get NameService contract for a TLD\nconst nsAddress = await manager.read.tldContracts(["hotdogs"]);\nconst nameService = getContract({\n  address: nsAddress,\n  abi: (NameServiceABI as any).abi,\n  client: publicClient,\n});`}
          />
        </div>

        {/* Registrations */}
        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 border glass-card border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <Code className="text-blue-500" />
              <h3 className="text-xl font-semibold text-foreground">
                Register
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Register a name under a TLD. The UI computes a simple price model
              and sends value.
            </p>
            <CodeBlock
              code={`// Node.js viem write (requires wallet)\nimport { parseEther } from "viem";\n\n// const { data: walletClient } = useAbstractClient(); // see setup at AGW documentation\n\nconst years = 1n;\nconst priceWei = parseEther("0.004"); // sample pricing logic\n\nconst registerHash = await walletClient.writeContract({\n  address: nameService.address,\n  abi: (NameServiceABI as any).abi,\n  functionName: "register",\n  args: ["alice", years],\n  value: priceWei,\n});\nconsole.log(registerHash);`}
            />
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Ensure the connected wallet has enough native token to cover price
              and gas.
            </p>
          </div>

          <div className="p-6 border glass-card border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <RefreshCw className="text-purple-500" />
              <h3 className="text-xl font-semibold text-foreground">Renew</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Extend an existing registration by a number of years.
            </p>
            <CodeBlock
              code={`// Node.js viem write\nconst renewYears = 2n;\nconst renewPriceWei = parseEther("0.008"); // align with pricing rules\n\nconst renewHash = await walletClient.writeContract({\n  address: nameService.address,\n  abi: (NameServiceABI as any).abi,\n  functionName: "renew",\n  args: ["alice", renewYears],\n  value: renewPriceWei,\n});\nconsole.log(renewHash);`}
            />
          </div>

          <div className="p-6 border glass-card border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <Link className="text-blue-500" />
              <h3 className="text-xl font-semibold text-foreground">
                Transfer
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Transfer a registered name to another address.
            </p>
            <CodeBlock
              code={`// Node.js viem write\nconst to = "0x12...21";\nconst transferHash = await walletClient.writeContract({\n  address: nameService.address,\n  abi: (NameServiceABI as any).abi,\n  functionName: "transferDomain",\n  args: ["alice", to],\n});\nconsole.log(transferHash);`}
            />
          </div>
        </div>

        {/* Additional Reads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border glass-card border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <FileText className="text-green-500" />
              <h3 className="text-xl font-semibold text-foreground">
                Expiration and pricing
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Read expiration from the per-TLD contract and compute UI pricing
              client-side.
            </p>
            <CodeBlock
              code={`// Read expiration\nconst expiresAt = await nameService.read.getDomainExpiration(["alice"]);\nconsole.log(Number(expiresAt)); // unix seconds\n\n// Example: derive UI price off-chain using our pricing tiers\nfunction getDomainPrice(nameLength: number, years: number): number {\n  if (nameLength === 3) return 0.012 * years;\n  if (nameLength === 4) return 0.01 * years;\n  if (nameLength === 5) return 0.008 * years;\n  if (nameLength === 6) return 0.006 * years;\n  return 0.004 * years;\n}`}
            />
          </div>

          <div className="p-6 border glass-card border-gray-200 dark:border-gray-700 rounded-xl space-y-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <Link className="text-blue-500" />
              <h3 className="text-xl font-semibold text-foreground">
                Main domain and owned domains
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Discover the main (primary) name and enumerate domains tied to an
              address.
            </p>
            <CodeBlock
              code={`// Primary name for address\nconst mainDomain = await manager.read.mainDomain(["0x12..21"]);\nconsole.log(mainDomain);\n\n// Enumerate address domains\nlet domains: string[] = [];\nlet index = 0;\nwhile (true) {\n  try {\n    const d = await manager.read.addressToDomains(["0x12..21", BigInt(i)]);\n    if (!d) break;\n    domains.push(d);\n  } catch {\n    break;\n  }\n}\nconsole.log(domains);`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
