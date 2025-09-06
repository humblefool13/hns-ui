import { NextResponse } from "next/server";
import { Address, createPublicClient, getContract, http } from "viem";
import HNSManagerABI from "../../../../contracts/HNSManager.json";

const HNS_MANAGER_ADDRESS = "0xc8d700ba82ec3ea353821c0cb087725aeb585560";

export async function GET() {
  try {
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

    const tlds: string[] = [];
    let index = 0;
    while (true) {
      try {
        const tld = (await contract.read.registeredTLDs([BigInt(index)])) as string;
        if (tld && tld !== "") {
          tlds.push(tld);
          index++;
        } else {
          break;
        }
      } catch {
        break;
      }
    }
    
    return NextResponse.json({ tlds });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch TLDs" }, { status: 500 });
  }
}


