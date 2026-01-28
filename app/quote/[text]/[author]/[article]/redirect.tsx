"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface QuoteRedirectProps {
  redirectUrl: string;
  quoteText: string;
  articleTitle: string;
}

function QuoteRedirect({
  redirectUrl,
  quoteText,
  articleTitle,
}: QuoteRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectUrl);
  }, [router, redirectUrl]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      <blockquote
        style={{
          maxWidth: "600px",
          fontSize: "18px",
          fontStyle: "italic",
          lineHeight: 1.6,
        }}
      >
        "{quoteText}"
      </blockquote>
      <p style={{ color: "var(--gray-11)", fontSize: "14px" }}>
        From "{articleTitle}"
      </p>
      <p style={{ color: "var(--gray-10)", fontSize: "13px" }}>
        Redirecting...
      </p>
    </div>
  );
}

export { QuoteRedirect };
