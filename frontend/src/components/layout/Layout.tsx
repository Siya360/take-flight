import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AIAssistant from "@/components/ai/AIAssistant";

interface LayoutProps {
  children: ReactNode;
  showAI?: boolean;
}

const Layout = ({ children, showAI = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showAI && <AIAssistant />}
    </div>
  );
};

export default Layout;