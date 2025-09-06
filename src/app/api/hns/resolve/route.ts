import { NextResponse } from "next/server";
import { Address, createPublicClient, getContract, http } from "viem";
import HNSManagerABI from "../../../../contracts/HNSManager.json";

const HNS_MANAGER_ADDRESS = process.env.HNS_MANAGER_ADDRESS as Address;

export async function POST(request: Request) {
  try {
    const { name, tld } = (await request.json()) as { name: string; tld: string };
    if (!name || !tld) {
      return NextResponse.json({ error: "Missing name or tld" }, { status: 400 });
    }

    const rpcUrl = process.env.ABSTRACT_RPC_URL;
    if (!rpcUrl) {
      return NextResponse.json({ error: "RPC URL not configured" }, { status: 500 });
    }
    const client = createPublicClient({ transport: http(rpcUrl) });
    const contract = getContract({
      address: HNS_MANAGER_ADDRESS as Address,
      abi: HNSManagerABI,
      client,
    }) as any;

    const result = (await contract.read.resolve([name, tld])) as [
      Address,
      bigint,
      Address,
      bigint
    ];

    return NextResponse.json({
      owner: result[0],
      expiration: result[1].toString(),
      nftAddress: result[2],
      tokenId: result[3].toString(),
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to resolve domain" }, { status: 500 });
  }
}