import React from "react";
import { Lenis } from "./lenis";
import { Vercel } from "./vercel";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Lenis />
      <Vercel />
      {children}
    </React.Fragment>
  );
};
