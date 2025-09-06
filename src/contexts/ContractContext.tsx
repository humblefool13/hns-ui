"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { getContract, type Address, parseEther, type Hex } from "viem";
import { useAccount } from "wagmi";
import { useAbstractClient } from "@abstract-foundation/agw-react";

// Import contract ABIs
import HNSManagerABI from "../contracts/HNSManager.json";
import NameServiceABI from "../contracts/NameService.json";

// Contract addresses (you can make these configurable)
export const HNS_MANAGER_ADDRESS = process.env.HNS_MANAGER_ADDRESS as Address;

// Types for contract interactions
export interface DomainInfo {
  owner: Address;
  expiration: bigint;
  nftAddress: Address;
  tokenId: bigint;
}

export interface ContractContextType {
  // Contract instances
  hnsManagerContract: any | null;
  nameServiceContracts: Map<string, any>; // TLD -> contract instance

  // Loading states
  isLoading: boolean;
  error: string | null;

  // HNS Manager functions
  getRegisteredTLDs: () => Promise<string[] | undefined>;
  getRegisteredTLDsRPC: () => Promise<string[] | undefined>;
  resolveDomain: (name: string, tld: string) => Promise<DomainInfo | null>;
  resolveDomainRPC: (name: string, tld: string) => Promise<DomainInfo | null>;
  reverseLookup: (address: Address) => Promise<string>;
  getAddressDomains: (address: Address) => Promise<string[]>;
  getMainDomain: (address: Address) => Promise<string>;

  // Name Service functions
  registerDomain: (name: string, tld: string, years: number) => Promise<string>;
  renewDomain: (name: string, tld: string, years: number) => Promise<string>;
  transferDomain: (name: string, tld: string, to: Address) => Promise<string>;
  getDomainPrice: (name: string, years: number) => number;
  getDomainExpiration: (name: string, tld: string) => Promise<bigint>;

  // Utility functions
  getNameServiceContract: (tld: string) => any;
  isConnected: boolean;
  address: Address | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameServiceContracts] = useState<Map<string, any>>(new Map());
  const { address, isConnected } = useAccount();
  const { data: abstractClient } = useAbstractClient();

  const hnsManagerContract = useMemo(() => {
    const effectiveClient = abstractClient as any;
    if (!effectiveClient) return null;

    return getContract({
      address: HNS_MANAGER_ADDRESS as Address,
      abi: HNSManagerABI,
      client: effectiveClient,
    }) as any;
  }, [abstractClient]);

  // Get or create NameService contract instance for a specific TLD
  const getNameServiceContract = (tld: string) => {
    if (nameServiceContracts.has(tld.toLowerCase())) {
      return nameServiceContracts.get(tld);
    }
    return null;
  };

  // HNS Manager read functions
  const getRegisteredTLDs = async (): Promise<string[] | undefined> => {
    try {
      if (hnsManagerContract) {
        const tlds: string[] = [];
        let index = 0;
        while (true) {
          try {
            const tld = (await hnsManagerContract.read.registeredTLDs([
              BigInt(index),
            ])) as string;
            if (tld && tld !== "") {
              tlds.push(tld);
              const address = (await hnsManagerContract.read.tldContracts([
                tld,
              ])) as Address;
              if (!nameServiceContracts.has(tld)) {
                nameServiceContracts.set(
                  tld,
                  getContract({
                    address: address,
                    abi: NameServiceABI,
                    client: abstractClient as any,
                  }) as any
                );
              }
              index++;
            } else {
              break;
            }
          } catch {
            break;
          }
        }
        return tlds;
      }
    } catch (err) {
      console.error("Error getting registered TLDs:", err);
      throw err;
    }
  };

  const getRegisteredTLDsRPC = async (): Promise<string[] | undefined> => {
    const res = await fetch("/api/hns/tlds", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch TLDs");
    const data = (await res.json()) as { tlds: string[] };
    return data.tlds ?? [];
  };

  const resolveDomain = async (
    name: string,
    tld: string
  ): Promise<DomainInfo | null> => {
    try {
      if (hnsManagerContract) {
        const result = (await hnsManagerContract.read.resolve([
          name.toLowerCase(),
          tld.toLowerCase(),
        ])) as [Address, bigint, Address, bigint];
        return {
          owner: result[0],
          expiration: result[1],
          nftAddress: result[2],
          tokenId: result[3],
        };
      }
      return null;
    } catch (err) {
      console.error("Error resolving domain:", err);
      return null;
    }
  };

  const resolveDomainRPC = async (
    name: string,
    tld: string
  ): Promise<DomainInfo | null> => {
    const res = await fetch("/api/hns/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, tld }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      owner: Address;
      expiration: string;
      nftAddress: Address;
      tokenId: string;
    };
    return {
      owner: data.owner,
      expiration: BigInt(data.expiration),
      nftAddress: data.nftAddress,
      tokenId: BigInt(data.tokenId),
    };
  };

  const reverseLookup = async (address: Address): Promise<string> => {
    if (!hnsManagerContract) {
      throw new Error("HNS Manager contract not initialized");
    }

    try {
      return (await hnsManagerContract.read.reverseLookup([address])) as string;
    } catch (err) {
      console.error("Error in reverse lookup:", err);
      throw err;
    }
  };

  const getAddressDomains = async (address: Address): Promise<string[]> => {
    if (!hnsManagerContract) {
      throw new Error("HNS Manager contract not initialized");
    }
    try {
      const domains: string[] = [];
      let index = 0;

      while (true) {
        try {
          const domain = (await hnsManagerContract.read.addressToDomains([
            address,
            BigInt(index),
          ])) as string;
          if (domain && domain !== "") {
            domains.push(domain);
            index++;
          } else {
            break;
          }
        } catch {
          break;
        }
      }

      return domains;
    } catch (err) {
      console.error("Error getting address domains:", err);
      throw err;
    }
  };

  const getMainDomain = async (address: Address): Promise<string> => {
    if (!hnsManagerContract) {
      throw new Error("HNS Manager contract not initialized");
    }
    let result: string = "";
    try {
      result = await hnsManagerContract.read.mainDomain([address]);
      if (result && result !== "" && result.length > 0) {
        return result;
      }
      return "";
    } catch (err) {
      if ((err as Error).name !== "ContractFunctionExecutionError") {
        throw err;
      }
      return "";
    }
  };

  const sendTransaction = async (
    functionName: string,
    args: any[],
    address: Address,
    value: bigint | null
  ): Promise<Hex> => {
    try {
      let name: string;
      switch (functionName) {
        case "register":
        case "renew":
          name = functionName;
          break;
        case "transfer":
          name = "transferDomain";
          break;
        default:
          throw new Error("Invalid function name: " + functionName);
      }
      if (!abstractClient) throw new Error("Abstract client not initialized");
      let transaction: Hex;
      if (value) {
        transaction = await abstractClient.writeContract({
          address,
          abi: NameServiceABI,
          functionName: name,
          args: args.map((arg) =>
            typeof arg === "string" ? arg.toLowerCase() : arg
          ),
          value,
        });
      } else {
        transaction = await abstractClient.writeContract({
          address,
          abi: NameServiceABI,
          functionName: name,
          args: args.map((arg) =>
            typeof arg === "string" ? arg.toLowerCase() : arg
          ),
        });
      }
      return transaction as Hex;
    } catch (err) {
      console.error("Error sending transaction:", err);
      throw err;
    }
  };

  // Name Service functions
  const registerDomain = async (
    name: string,
    tld: string,
    years: number
  ): Promise<string> => {
    try {
      const contract = getNameServiceContract(tld);
      if (!contract)
        throw new Error("Name service contract not initialized for " + tld);
      const price = getDomainPrice(name, years);
      const hex = await sendTransaction(
        "register",
        [name, BigInt(years)],
        contract.address,
        parseEther(price.toString())
      );
      return hex as string;
    } catch (err) {
      console.error("Error registering domain:", err);
      throw err;
    }
  };

  const renewDomain = async (
    name: string,
    tld: string,
    years: number
  ): Promise<string> => {
    try {
      const contract = getNameServiceContract(tld);
      if (!contract)
        throw new Error("Name service contract not initialized for " + tld);
      const price = getDomainPrice(name, years);
      const hex = await sendTransaction(
        "renew",
        [name, BigInt(years)],
        contract.address,
        parseEther(price.toString())
      );
      return hex as string;
    } catch (err) {
      console.error("Error renewing domain:", err);
      throw err;
    }
  };

  const transferDomain = async (
    name: string,
    tld: string,
    to: Address
  ): Promise<string> => {
    try {
      const contract = getNameServiceContract(tld);
      if (!contract)
        throw new Error("Name service contract not initialized for " + tld);
      const hex = await sendTransaction(
        "transfer",
        [name, to],
        contract.address,
        null
      );
      return hex as string;
    } catch (err) {
      console.error("Error transferring domain:", err);
      throw err;
    }
  };

  const getDomainPrice = (name: string, years: number): number => {
    try {
      let ethPrice: number;
      if (name.length === 3) {
        ethPrice = 0.012 * years;
      } else if (name.length === 4) {
        ethPrice = 0.01 * years;
      } else if (name.length === 5) {
        ethPrice = 0.008 * years;
      } else if (name.length === 6) {
        ethPrice = 0.006 * years;
      } else {
        ethPrice = 0.004 * years;
      }
      return ethPrice;
    } catch (err) {
      console.error("Error getting domain price:", err);
      throw err;
    }
  };

  const getDomainExpiration = async (
    name: string,
    tld: string
  ): Promise<bigint> => {
    try {
      const contract = getNameServiceContract(tld);
      if (!contract)
        throw new Error("Name service contract not initialized for " + tld);
      return await contract.read.getExpiration([name]);
    } catch (err) {
      console.error("Error getting domain expiration:", err);
      throw err;
    }
  };

  // Initialize contracts
  useEffect(() => {
    const initializeContracts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (hnsManagerContract) {
          await getRegisteredTLDs();
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing contracts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize contracts"
        );
        setIsLoading(false);
      }
    };

    if (hnsManagerContract) {
      initializeContracts();
    }
  }, [hnsManagerContract]);

  const contextValue: ContractContextType = {
    hnsManagerContract,
    nameServiceContracts,
    isLoading,
    error,
    getRegisteredTLDs,
    getRegisteredTLDsRPC,
    resolveDomain,
    resolveDomainRPC,
    reverseLookup,
    getAddressDomains,
    getMainDomain,
    registerDomain,
    renewDomain,
    transferDomain,
    getDomainPrice,
    getDomainExpiration,
    getNameServiceContract,
    isConnected,
    address,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};
