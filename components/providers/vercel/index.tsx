import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";

export const Vercel = () => {
  return (
    <React.Fragment>
      <SpeedInsights />
      <Analytics />
    </React.Fragment>
  );
};
