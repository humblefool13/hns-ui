'use client';

import { AbstractPrivyProvider } from "@abstract-foundation/agw-react/privy";
import { abstract } from "wagmi/chains";
const abstractId = 'cm04asygd041fmry9zmcyn5o5';
const appId = 'cmeeq3d5u00l6kz0bzkkklsw3'
export default function AbstractProvider({ children }: { children: React.ReactNode }) {
  return (
    <AbstractPrivyProvider appId={appId} chain={abstract}>
      {children}
    </AbstractPrivyProvider>
  );
}
