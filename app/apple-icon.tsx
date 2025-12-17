import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 120,
        background: "#111113",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fcfcfc",
        borderRadius: 40,
        fontWeight: 600,
        fontFamily: "system-ui",
      }}
    >
      U
    </div>,
    {
      ...size,
    },
  );
}
