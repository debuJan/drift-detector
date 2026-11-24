import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Paste an AI agent's declared plan and its tool-call log. Drift Detector flags every call that went off-plan.",
  title: "Drift Detector — did your agent stick to the plan?",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
