import React from "react";
import { Lenis } from "./lenis";
import { Theme } from "./theme";
import { Vercel } from "./vercel";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Lenis />
      <Vercel />
      <Theme />
      {children}
    </React.Fragment>
  );
};
