"use client";

import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractTestnet, abstract } from "viem/chains";

const appId = "cmeeq3d5u00l6kz0bzkkklsw3";
export default function AbstractProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AbstractWalletProvider chain={abstractTestnet}>
      {children}
    </AbstractWalletProvider>
  );
}
