import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Script",
  description: "Generate a new viral AI script and thumbnail.",
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
