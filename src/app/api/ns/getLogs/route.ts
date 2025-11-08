import { NextResponse } from "next/server";
import {
  decodeEventLog,
  keccak256,
  toHex,
  createPublicClient,
  getContract,
  http,
  Address,
  hexToNumber
} from "viem";
import NameServiceABI from "../../../../contracts/NameService.json";

export async function POST(request: Request) {
  try {
    const { address, tld } = (await request.json()) as {
      address: string;
      tld: string;
    };
    if (!address || !tld) {
      return NextResponse.json(
        { error: "Missing address or tld" },
        { status: 400 }
      );
    }

    const rpcUrl = process.env.ABSTRACT_RPC_URL;
    if (!rpcUrl) {
      return NextResponse.json(
        { error: "RPC URL not configured" },
        { status: 500 }
      );
    }

    const client = createPublicClient({ transport: http(rpcUrl) });
    const contract = getContract({
      address: address as Address,
      abi: NameServiceABI,
      client
    }) as any;

    const getNameFromId = async (id: BigInt) => {
      if (!id) return "";
      return await contract.read.tokenToDomain([id]);
    };

    const sig1 = keccak256(toHex("DomainRegistered(uint256,address,uint256)"));
    const sig2 = keccak256(toHex("DomainRenewed(uint256,address,uint256)"));
    const sig3 = keccak256(toHex("DomainTransferred(uint256,address,address)"));
    const sig4 = keccak256(toHex("DomainExpired(uint256,address)"));

    const route = "eth_getLogs";

    const sigs = [sig1, sig2, sig3, sig4];

    const requests = sigs.map((sig) =>
      fetch(`${rpcUrl}/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getLogs",
          params: [
            {
              fromBlock: "earliest",
              toBlock: "latest",
              address,
              topics: [sig]
            }
          ]
        })
      }).then((res) => res.json())
    );

    const responses = await Promise.all(requests);
    const events = responses.flatMap((res) => res.result);

    type EventItem = {
      id: string; // transaction hash + log index
      type: "register" | "renew" | "transfer" | "expire";
      domain: string;
      txHash: string;
      blockNumber: number;
      tokenId: bigint;
      timestamp: number;
      tld: string;
      expiration?: bigint;
      from?: string;
      to?: string;
    };

    let formattedEvents: EventItem[] = [];

    for (const log of events) {
      try {
        const decoded = decodeEventLog({
          abi: NameServiceABI,
          data: log.data,
          topics: log.topics
        });
        const args: any = decoded.args;
        const type: "register" | "renew" | "transfer" | "expire" | undefined =
          decoded.eventName === "DomainRegistered"
            ? "register"
            : decoded.eventName === "DomainRenewed"
              ? "renew"
              : decoded.eventName === "DomainTransferred"
                ? "transfer"
                : decoded.eventName === "DomainExpired"
                  ? "expire"
                  : undefined;

        if (!type) {
          continue;
        }

        const event: EventItem = {
          id: log.transactionHash + log.logIndex,
          type,
          domain: await getNameFromId(args?.tokenId as bigint),
          txHash: log.transactionHash,
          blockNumber: hexToNumber(log.blockNumber),
          tokenId: args?.tokenId as bigint,
          timestamp: hexToNumber(log.blockTimestamp),
          tld,
          from:
            (args?.from as string) ||
            (args?.previousOwner as string) ||
            (args?.owner as string) ||
            "",
          to: args?.to as string,
          expiration:
            (args?.expiration as bigint) || (args?.newExpiration as bigint)
        };
        formattedEvents.push(event);
      } catch (err) {
        console.error("Failed to decode log:", err);
      }
    }

    // Convert BigInt values to strings for JSON serialization
    const serializedEvents = formattedEvents.map((event) => {
      return {
        ...event,
        tokenId: event.tokenId?.toString() || "",
        expiration: event.expiration?.toString() || ""
      };
    });

    return NextResponse.json({
      events: serializedEvents
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to get logs: " + e },
      { status: 500 }
    );
  }
}
