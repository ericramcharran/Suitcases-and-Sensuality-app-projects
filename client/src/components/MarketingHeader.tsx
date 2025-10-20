import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import heartLogo from "@assets/logo transparent no name_1760959575281.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "wouter";

export function MarketingHeader() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            data-testid="link-header-logo"
          >
            <motion.img 
              src={heartLogo} 
              alt="Heart Logo" 
              className="w-20 h-20 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            />
            <h1 className="text-2xl font-medium" style={{ marginLeft: '-0.6cm' }}>
              <motion.span 
                className="text-black dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                The Executive{" "}
              </motion.span>
              <motion.span 
                className="text-red-600 font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                Society
              </motion.span>
            </h1>
          </div>
        </Link>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              data-testid="button-menu-toggle"
              variant="ghost" 
              size="icon"
              className="hover-elevate active-elevate-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 border-l-2 border-primary/40">
            <nav className="flex flex-col gap-2 mt-6">
              <Link href="/about">
                <a
                  data-testid="nav-about"
                  className="block w-full text-left py-2 px-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary active-elevate-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
              </Link>
              <Link href="/features">
                <a
                  data-testid="nav-features"
                  className="block w-full text-left py-2 px-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary active-elevate-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
              </Link>
              <Link href="/how-it-works">
                <a
                  data-testid="nav-how-it-works"
                  className="block w-full text-left py-2 px-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary active-elevate-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
              </Link>
              <Link href="/pricing">
                <a
                  data-testid="nav-pricing"
                  className="block w-full text-left py-2 px-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary active-elevate-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </a>
              </Link>
              <Link href="/faq">
                <a
                  data-testid="nav-faq"
                  className="block w-full text-left py-2 px-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary active-elevate-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
              </Link>
              <Link href="/download">
                <a
                  data-testid="nav-download"
                  className="block w-full text-left py-2 px-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary active-elevate-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Download App
                </a>
              </Link>
              <div className="mt-4">
                <Button
                  data-testid="button-menu-get-started"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setLocation("/download");
                  }}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
