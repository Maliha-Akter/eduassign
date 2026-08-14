// import Footer from "@/components/Footer";
// import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <div className="grow flex flex-col">{children}</div>;
}