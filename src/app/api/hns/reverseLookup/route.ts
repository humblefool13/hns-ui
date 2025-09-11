import { NextResponse } from "next/server";
import { type Address, createPublicClient, getContract, http } from "viem";
import HNSManagerABI from "../../../../contracts/HNSManager.json";

const HNS_MANAGER_ADDRESS = process.env.HNS_MANAGER_ADDRESS as Address;

// CORS headers for free API access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

export async function POST(request: Request) {
  try {
    const { address } = (await request.json()) as { address: string };
    if (!address) {
      return NextResponse.json(
        { error: "Missing address" },
        { status: 400, headers: corsHeaders }
      );
    }
    const rpcUrl = process.env.ABSTRACT_RPC_URL;
    if (!rpcUrl) {
      return NextResponse.json(
        { error: "RPC URL not configured" },
        { status: 500, headers: corsHeaders }
      );
    }
    const client = createPublicClient({ transport: http(rpcUrl) });
    const contract = getContract({
      address: HNS_MANAGER_ADDRESS as Address,
      abi: HNSManagerABI,
      client
    }) as any;

    let names: string[] = [];
    let index = 0;
    while (true) {
      try {
        const name = (await contract.read.addressToDomains([
          address,
          BigInt(index)
        ])) as string;
        if (name && name !== "") {
          names.push(name);
          index++;
        } else {
          break;
        }
      } catch {
        break;
      }
    }

    const mainDomain =
      ((await contract.read.mainDomain([address])) as string) || "";

    return NextResponse.json(
      { address, names, mainDomain },
      {
        headers: corsHeaders
      }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Failed to fetch names" },
      { status: 500, headers: corsHeaders }
    );
  }
}
