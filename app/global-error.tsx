"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "48px 24px",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#fcfcfc",
          color: "#1a1a1a",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 600, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "16px", color: "#6b6b6b", margin: 0 }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#1a1a1a",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
