"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { getContract, type Address } from "viem";
import { useAccount } from "wagmi";
import { useAbstractClient } from "@abstract-foundation/agw-react";

// Import contract ABIs
import HNSManagerABI from "../../contracts/HNSManager.json";
import NameServiceABI from "../../contracts/NameService.json";

// Contract addresses (you can make these configurable)
const HNS_MANAGER_ADDRESS = "0xc8d700ba82ec3ea353821c0cb087725aeb585560";

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
  getRegisteredTLDs: () => Promise<string[]>;
  resolveDomain: (name: string, tld: string) => Promise<DomainInfo | null>;
  reverseLookup: (address: Address) => Promise<string>;
  getAddressDomains: (address: Address) => Promise<string[]>;
  getMainDomain: (address: Address) => Promise<string>;

  // Name Service functions
  registerDomain: (name: string, tld: string, years: number) => Promise<void>;
  renewDomain: (name: string, tld: string, years: number) => Promise<void>;
  transferDomain: (name: string, tld: string, to: Address) => Promise<void>;
  getDomainPrice: (name: string, years: number) => Promise<number>;
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
    if (!abstractClient) return null;

    return getContract({
      address: HNS_MANAGER_ADDRESS as Address,
      abi: HNSManagerABI.abi,
      client: abstractClient,
    });
  }, [abstractClient]);

  // Get or create NameService contract instance for a specific TLD
  const getNameServiceContract = (tld: string) => {
    if (nameServiceContracts.has(tld)) {
      return nameServiceContracts.get(tld);
    }
    return null;
  };

  // HNS Manager read functions
  const getRegisteredTLDs = async (): Promise<string[]> => {
    if (!hnsManagerContract) {
      throw new Error("HNS Manager contract not initialized");
    }
    try {
      const tlds: string[] = [];
      let index = 0;
      if (!abstractClient) return [];
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
                  abi: NameServiceABI.abi,
                  client: abstractClient,
                })
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
    } catch (err) {
      console.error("Error getting registered TLDs:", err);
      throw err;
    }
  };

  const resolveDomain = async (
    name: string,
    tld: string
  ): Promise<DomainInfo | null> => {
    if (!hnsManagerContract) {
      throw new Error("HNS Manager contract not initialized");
    }

    try {
      const result = (await hnsManagerContract.read.resolve([name, tld])) as [
        Address,
        bigint,
        Address,
        bigint
      ];
      return {
        owner: result[0],
        expiration: result[1],
        nftAddress: result[2],
        tokenId: result[3],
      };
    } catch (err) {
      console.error("Error resolving domain:", err);
      return null;
    }
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

    try {
      return (await hnsManagerContract.read.mainDomain([address])) as string;
    } catch (err) {
      console.error("Error getting main domain:", err);
      throw err;
    }
  };

  // Name Service functions
  const registerDomain = async (
    name: string,
    tld: string,
    years: number
  ): Promise<void> => {
    try {
      const contract = getNameServiceContract(tld);
      if (!contract)
        throw new Error("Name service contract not initialized for " + tld);
      const price = getDomainPrice(name, years);
      await contract.write.register([name, BigInt(years)], {
        value: price,
      });
    } catch (err) {
      console.error("Error registering domain:", err);
      throw err;
    }
  };

  const renewDomain = async (
    name: string,
    tld: string,
    years: number
  ): Promise<void> => {
    try {
      const contract = getNameServiceContract(tld);
      if (!contract)
        throw new Error("Name service contract not initialized for " + tld);
      const price = getDomainPrice(name, years);

      await contract.write.renew([name, BigInt(years)], {
        value: price,
      });
    } catch (err) {
      console.error("Error renewing domain:", err);
      throw err;
    }
  };

  const transferDomain = async (
    name: string,
    tld: string,
    to: Address
  ): Promise<void> => {
    try {
      const contract = getNameServiceContract(tld);
      if (!contract)
        throw new Error("Name service contract not initialized for " + tld);
      await contract.write.transfer([name, to]);
    } catch (err) {
      console.error("Error transferring domain:", err);
      throw err;
    }
  };

  const getDomainPrice = async (
    name: string,
    years: number
  ): Promise<number> => {
    try {
      if (name.length === 3) {
        return 0.012 * years;
      } else if (name.length === 4) {
        return 0.01 * years;
      } else if (name.length === 5) {
        return 0.008 * years;
      } else if (name.length === 6) {
        return 0.006 * years;
      } else {
        return 0.004 * years;
      }
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

    if (abstractClient && hnsManagerContract) {
      initializeContracts();
    } else if (!abstractClient) {
      setIsLoading(true);
    }
  }, [abstractClient]);

  const contextValue: ContractContextType = {
    hnsManagerContract,
    nameServiceContracts,
    isLoading,
    error,
    getRegisteredTLDs,
    resolveDomain,
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
